import { GameFilters } from "@contracts/database/games";
import { GameActions, GameState } from "@contracts/store/game";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      archiveGame: async (id: string) => {
        await window.ipc.game.archiveGameById(id);
        await get().refreshGameData();
      },
      deleteGame: async (id: string) => {
        await window.ipc.game.deleteGameById(id);
        await get().refreshGameData();
      },
      fetchFilteredGames: async (filters: GameFilters) => {
        return await window.ipc.game.getFilteredGames(filters);
      },
      fetchGameDetails: async (id: string) => {
        const details = await window.ipc.game.getGameById(id);
        if (!details) return null;
        set((state) => ({
          gamesDetails: {
            ...state.gamesDetails,
            [id]: details,
          },
        }));
        return details;
      },
      fetchGameFilters: async () => {
        const gameFilters = await window.ipc.game.getGameFilters();
        set({ gameFilters });
      },
      fetchGamesList: async () => {
        const gamesList = await window.ipc.game.getGamesList();
        set({ gamesList });
      },

      fetchNewGames: async () => {
        const newGames = await window.ipc.game.getNewGames();
        set({ newGames });
      },
      fetchQuickLaunchGames: async () => {
        const quickLaunchGames = await window.ipc.game.getQuickLaunchGames();
        set({ quickLaunchGames });
      },
      gameFilters: {},
      gamesDetails: {},
      gamesList: [],
      getRandomGame: () => {
        const gamesList = get().gamesList;
        const randomGame = gamesList[Math.floor(Math.random() * gamesList.length)];
        return randomGame;
      },
      newGames: [],
      quickLaunchGames: [],
      quickLaunchGamesOrder: [],
      refreshGameData: async () => {
        await Promise.all([
          get().fetchQuickLaunchGames(),
          get().fetchNewGames(),
          get().fetchGamesList(),
          get().fetchGameFilters(),
        ]);
      },
      setQuickLaunchGameOrder: (ids: string[]) => set({ quickLaunchGamesOrder: ids }),
      toggleFavouriteGame: async (id: string) => {
        const game = await window.ipc.game.toggleFavouriteGame(id);
        if (!game) return null;
        set((state) => ({
          gamesDetails: {
            ...state.gamesDetails,
            [id]: game,
          },
        }));
        await get().refreshGameData();

        return game;
      },
      toggleQuickLaunchGame: async (id: string) => {
        const response = await window.ipc.game.toggleQuickLaunchGame(id);
        if (!response) return;
        const { isQuickLaunch } = response;

        await get().refreshGameData();

        set((state) => {
          if (!isQuickLaunch) {
            return {
              quickLaunchGamesOrder: state.quickLaunchGamesOrder.filter((gameId) => gameId !== id),
            };
          }

          if (state.quickLaunchGamesOrder.includes(id)) {
            return state;
          }

          return {
            quickLaunchGamesOrder: [...state.quickLaunchGamesOrder, id],
          };
        });
      },
    }),
    {
      name: "games",
      partialize: (state) => ({
        quickLaunchGamesOrder: state.quickLaunchGamesOrder,
      }),
      storage: createConfStorage(conf),
    },
  ),
);

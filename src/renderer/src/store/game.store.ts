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
      gamesDetails: {},
      gamesList: [],
      gameFilters: {},
      newGames: [],
      quickLaunchGames: [],
      quickLaunchGamesOrder: [],

      archiveGame: async (id: string) => {
        await window.api.archiveGame(id);
        await get().refreshGameData();
      },
      deleteGame: async (id: string) => {
        await window.api.deleteGame(id);
        await get().refreshGameData();
      },
      fetchFilteredGames: async (filters: GameFilters) => {
        return await window.api.getFilteredGames(filters);
      },
      fetchGameDetails: async (id: string) => {
        const details = await window.api.getGameById(id);
        set((state) => ({
          gamesDetails: {
            ...state.gamesDetails,
            [id]: details,
          },
        }));
        return details;
      },
      fetchGameFilters: async () => {
        const gameFilters = await window.api.getGameFilters();
        set({ gameFilters });
      },
      fetchGamesList: async () => {
        const gamesList = await window.api.getGamesList();
        set({ gamesList });
      },
      fetchNewGames: async () => {
        const newGames = await window.api.getNewGames();
        set({ newGames });
      },
      fetchQuickLaunchGames: async () => {
        const quickLaunchGames = await window.api.getQuickLaunchGames();
        set({ quickLaunchGames });
      },
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
        const game = await window.api.toggleFavouriteGame(id);
        set((state) => ({
          gamesDetails: {
            ...state.gamesDetails,
            [id]: game,
          },
        }));

        return game;
      },
      toggleQuickLaunchGame: async (id: string) => {
        const { isQuickLaunch } = await window.api.toggleQuickLaunchGame(id);

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

        await get().fetchQuickLaunchGames();
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

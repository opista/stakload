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
      collections: [],
      collectionsCache: {},

      fetchCollectionGames: async (id: string) => {
        const cachedList = get().collectionsCache[id];

        if (cachedList) {
          return cachedList;
        }

        const list = await window.api.getCollectionGames(id);
        set({ collectionsCache: { ...get().collectionsCache, [id]: list } });

        return list;
      },
      fetchCollections: async () => {
        const collections = await window.api.getCollections();
        set({ collections });
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
      fetchGamesList: async () => {
        const games = await window.api.getGamesList();
        set({ gamesList: games });
      },
      fetchNewGames: async () => {
        const games = await window.api.getNewGames();
        set({ newGames: games });
      },
      fetchQuickLaunchGames: async () => {
        const quickLaunchGames = await window.api.getQuickLaunchGames();
        set({ quickLaunchGames });
      },
      gamesDetails: {},
      gamesList: [],

      invalidateCollectionCache: () => set({ collectionsCache: {} }),
      newGames: [],
      quickLaunchGames: [],
      quickLaunchGamesOrder: [],

      setQuickLaunchGameOrder: (ids: string[]) => set({ quickLaunchGamesOrder: ids }),
      toggleQuickLaunchGame: async (id: string) => {
        const { quickLaunch } = await window.api.toggleQuickLaunchGame(id);

        set((state) => {
          if (!quickLaunch) {
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

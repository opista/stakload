import { CollectionStoreModel } from "@contracts/database/collections";
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

      fetchCollectionGames: async (id: string, { forceFetch = false }: { forceFetch?: boolean } = {}) => {
        if (!forceFetch) {
          const cachedList = get().collectionsCache[id];

          if (cachedList) {
            return cachedList;
          }
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
      gamesDetails: {},
      gamesList: [],
      gameFilters: {},

      invalidateCollectionCache: () => set({ collectionsCache: {} }),
      newGames: [],
      quickLaunchGames: [],
      quickLaunchGamesOrder: [],

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
      },
      updateCollection: async (id: string, updates: Pick<CollectionStoreModel, "name" | "filters" | "icon">) => {
        await window.api.updateCollection(id, updates);
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

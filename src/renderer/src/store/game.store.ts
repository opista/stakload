import { GameFilters } from "@contracts/database/games";
import { GameActions, GameState } from "@contracts/store/game";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

const DEFAULT_FILTERS = {
  ageRatings: undefined,
  developers: undefined,
  gameModes: undefined,
  genres: undefined,
  isInstalled: undefined,
  libraries: undefined,
  platforms: undefined,
  playerPerspectives: undefined,
  publishers: undefined,
};

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
        const games = await window.api.getFilteredGames(filters);
        set({ gamesList: games });
        return games;
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
      resetFilters: () => set({ selectedFilters: DEFAULT_FILTERS }),
      selectedCollection: "",
      selectedFilters: DEFAULT_FILTERS,

      setQuickLaunchGameOrder: (ids: string[]) => set({ quickLaunchGamesOrder: ids }),
      setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
      setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
        set((state) => ({
          selectedFilters: {
            ...state.selectedFilters,
            [key]: value,
          },
        })),
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

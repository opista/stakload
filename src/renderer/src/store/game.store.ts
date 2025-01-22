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

      fetchCollections: async () => {
        const collections = await window.api.getCollections();
        set({ collections });
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
      gamesPreview: {},
      newGames: [],
      quickLaunchGames: [],
      quickLaunchGamesOrder: [],
      resetFilters: () => set({ selectedFilters: DEFAULT_FILTERS }),
      selectedCollection: "",
      selectedFilters: DEFAULT_FILTERS,
      selectedGame: null,

      setCurrentCollection: (id: string) => {
        const currentCollection = get().collections.find(({ _id }) => _id === id);
        set({ currentCollection });
      },

      setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) =>
        set(() => ({
          selectedFilters: {
            ...DEFAULT_FILTERS,
            ...filters,
          },
        })),
      setQuickLaunchGameOrder: (ids: string[]) => set({ quickLaunchGamesOrder: ids }),
      setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
      setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
        set((state) => ({
          selectedFilters: {
            ...state.selectedFilters,
            [key]: value,
          },
        })),
      setSelectedGame: (selectedGame: string | null) => set({ selectedGame }),
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
      storage: createConfStorage(conf),
    },
  ),
);

import { GameState } from "@contracts/store/game";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

const DEFAULT_FILTERS = {
  developers: undefined,
  gameModes: undefined,
  genres: undefined,
  playerPerspectives: undefined,
  publishers: undefined,
};

type GameActions = {
  resetFilters: () => void;
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) => void;
  setSelectedCollection: (selectedCollection: string) => void;
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) => void;
  setSelectedGame: (selectedGame: GameState["selectedGame"]) => void;
};

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      selectedCollection: "",
      selectedGame: null,
      selectedFilters: DEFAULT_FILTERS,
      resetFilters: () => set({ selectedFilters: DEFAULT_FILTERS }),
      setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) =>
        set(() => ({
          selectedFilters: {
            ...DEFAULT_FILTERS,
            ...filters,
          },
        })),
      setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
      setSelectedGame: (selectedGame: string | null) => set({ selectedGame }),
      setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
        set((state) => ({
          selectedFilters: {
            ...state.selectedFilters,
            [key]: value,
          },
        })),
    }),
    {
      name: "game",
      storage: createConfStorage(conf),
    },
  ),
);

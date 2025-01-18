import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

export const LibraryView = () => {
  const gamesList = useGameStore(useShallow((state) => state.gamesList));
  return <GamesGrid games={gamesList} />;
};

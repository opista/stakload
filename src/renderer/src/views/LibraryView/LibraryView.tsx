import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { useGameStore } from "@store/game.store";

export const LibraryView = () => {
  const games = useGameStore((state) => state.games);
  return <GamesGrid games={games} />;
};

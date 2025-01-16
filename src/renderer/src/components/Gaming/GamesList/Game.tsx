import { GameCover } from "@components/GameCover/GameCover";
import { GameStoreModel } from "@contracts/database/games";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

import classes from "./Game.module.css";

type GameProps = {
  game: GameStoreModel;
  onFocus: (game: GameStoreModel) => void;
  onSelect: (game: GameStoreModel) => void;
  size: number;
  start: number;
};

export const Game = ({ game, onFocus, onSelect, size, start }: GameProps) => {
  const { ref } = useFocusable({
    focusable: true,
    focusKey: `GAME-${game?._id}`,
    onEnterPress: () => onSelect(game),
    onFocus: () => onFocus(game),
  });

  return (
    <div
      className={classes.container}
      ref={ref}
      style={{
        transform: `translateX(${start}px)`,
        width: `${size}px`,
      }}
    >
      <GameCover game={game} hoverEffect={false} />
    </div>
  );
};

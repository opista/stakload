import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";

import classes from "./Game.module.css";

type GameProps = {
  game: GameListModel;
  onFocus: (game: GameListModel) => void;
  onSelect: (game: GameListModel) => void;
  size: number;
  start: number;
};

export const Game = ({ game, onFocus, onSelect, size, start }: GameProps) => {
  const { ref } = useFocusable({
    focusKey: `GAME-${game?._id}`,
    focusable: true,
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

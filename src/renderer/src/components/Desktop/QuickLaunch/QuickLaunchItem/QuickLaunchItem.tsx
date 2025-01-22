import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Flex, Text } from "@mantine/core";
import { useNavigate } from "react-router";

import classes from "./QuickLaunchItem.module.css";

type QuickLaunchItemProps = {
  editMode?: boolean;
  game: GameListModel;
};

export const QuickLaunchItem = ({ editMode, game }: QuickLaunchItemProps) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: game._id });

  const style = {
    cursor: editMode ? "grab" : "default",
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onClick = () => {
    if (!editMode) {
      navigate(`/desktop/library/${game._id}`);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...(editMode ? { ...attributes, ...listeners } : {})}>
      <Flex className={classes.container} onClick={onClick}>
        <GameCover className={classes.gameCover} game={game} hoverEffect={false} showGameTitle={false} />
        <Text lineClamp={1} size="xs">
          {game.name}
        </Text>
        {/* <Text>Launch</Text> */}
      </Flex>
    </div>
  );
};

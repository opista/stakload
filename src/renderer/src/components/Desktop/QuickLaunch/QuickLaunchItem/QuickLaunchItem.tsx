import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Flex, Group, Stack, Text } from "@mantine/core";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import classes from "./QuickLaunchItem.module.css";

type QuickLaunchItemProps = {
  editMode?: boolean;
  game: GameListModel;
};

export const QuickLaunchItem = ({ editMode, game }: QuickLaunchItemProps) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: game._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "default",
    opacity: isDragging ? 0.5 : 1,
  };

  const onClick = () => {
    if (editMode) return;

    if (game.isInstalled) {
      return window.api.launchGame(game._id);
    }

    return window.api.installGame(game._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx({ [classes.dragging]: isDragging })}
    >
      <Flex
        className={clsx(classes.container, {
          [classes.clickable]: !editMode,
        })}
        onClick={onClick}
      >
        <GameCover
          className={classes.gameCover}
          game={game}
          hoverEffect={false}
          showGameTitle={false}
          showLibraryIcon={false}
        />
        <Stack className={classes.textContainer}>
          <Text className={classes.gameName} lineClamp={1} size="xs">
            {game.name}
          </Text>
          <Group className={classes.launchGroup} gap={4}>
            <IconPlayerPlayFilled size={12} />
            <Text className={classes.launchText} size="xs">
              {game.isInstalled ? t("quickLaunch.launch") : t("quickLaunch.install")}
            </Text>
          </Group>
        </Stack>
      </Flex>
    </div>
  );
};

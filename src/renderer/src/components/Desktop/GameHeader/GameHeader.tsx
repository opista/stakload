import ActionIcon from "@components/ActionIcon/ActionIcon";
import { GameControls } from "@components/Desktop/GameControls/GameControls";
import { GameStoreModel } from "@contracts/database/games";
import { Container, Flex, Group } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconBolt, IconBoltFilled, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameHeader.module.css";

type GameHeaderProps = {
  game: GameStoreModel;
};

export const GameHeader = ({ game }: GameHeaderProps) => {
  const { toggleFavouriteGame, toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleFavouriteGame: state.toggleFavouriteGame,
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );

  const onDelete = () => {
    modals.openContextModal({
      innerProps: {
        id: game._id,
        name: game.name,
        navigateTo: "..",
      },
      modal: "removeGame",
      size: "sm",
      title: t("removeGameModal.title"),
    });
  };

  return (
    <div className={classes.container}>
      <Container size="responsive">
        <Flex className={classes.header} justify="space-between">
          <Group>
            <GameControls game={game} />
          </Group>
          <Group gap="xs">
            <ActionIcon
              aria-label="Favourite"
              icon={game.isFavourite ? IconStarFilled : IconStar}
              onClick={() => toggleFavouriteGame(game._id)}
            />
            <ActionIcon
              aria-label="Quick access"
              icon={game.isQuickLaunch ? IconBoltFilled : IconBolt}
              onClick={() => toggleQuickLaunchGame(game._id)}
            />
            <ActionIcon aria-label={t("common.delete")} icon={IconTrash} onClick={onDelete} />
          </Group>
        </Flex>
      </Container>
    </div>
  );
};

import ActionIcon from "@components/ActionIcon/ActionIcon";
import { GameControls } from "@components/Desktop/GameControls/GameControls";
import { RemoveGameModal } from "@components/RemoveGameModal/RemoveGameModal";
import { GameStoreModel } from "@contracts/database/games";
import { Container, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGameStore } from "@store/game.store";
import { IconBolt, IconPencil, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameHeader.module.css";

type GameHeaderProps = {
  game: GameStoreModel;
};

export const GameHeader = ({ game }: GameHeaderProps) => {
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const navigate = useNavigate();

  const { toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );

  const toggleFavouriteGame = () => window.api.toggleFavouriteGame(game._id);

  const onRemoveConfirm = async (preventReadd: boolean) => {
    await window.api.removeGame(game._id, preventReadd);
    navigate("..");
    closeDelete();
  };

  return (
    <div className={classes.container}>
      <Container size="responsive">
        <Flex className={classes.header} justify="space-between">
          <RemoveGameModal
            gameTitle={game.name}
            onClose={closeDelete}
            onConfirm={onRemoveConfirm}
            opened={openedDelete}
          />
          <Group>
            <GameControls game={game} />
          </Group>
          <Group gap="xs">
            <ActionIcon
              aria-label="Favourite"
              icon={game.isFavourite ? IconStarFilled : IconStar}
              onClick={() => toggleFavouriteGame()}
            />
            <ActionIcon aria-label="Quick access" icon={IconBolt} onClick={() => toggleQuickLaunchGame(game._id)} />
            <ActionIcon aria-label={t("common.edit")} disabled icon={IconPencil} onClick={() => console.log("edit")} />
            <ActionIcon aria-label={t("common.delete")} icon={IconTrash} onClick={openDelete} />
          </Group>
        </Flex>
      </Container>
    </div>
  );
};

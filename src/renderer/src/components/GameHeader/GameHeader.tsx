import ActionIcon from "@components/ActionIcon/ActionIcon";
import { RemoveGameModal } from "@components/RemoveGameModal/RemoveGameModal";
import { GameStoreModel } from "@contracts/database/games";
import { Container, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useNavigate } from "react-router";

import classes from "./GameHeader.module.css";

type GameHeaderProps = {
  game: GameStoreModel;
};

export const GameHeader = ({ game }: GameHeaderProps) => {
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const navigate = useNavigate();

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
          <Group gap="xs">
            <ActionIcon aria-label={t("common.edit")} disabled icon={IconPencil} onClick={() => console.log("edit")} />
            <ActionIcon aria-label={t("common.delete")} icon={IconTrash} onClick={openDelete} />
          </Group>
        </Flex>
      </Container>
    </div>
  );
};

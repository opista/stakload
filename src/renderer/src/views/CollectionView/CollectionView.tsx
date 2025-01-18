import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameListModel } from "@contracts/database/games";
import { ActionIcon, Flex, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

export const CollectionView = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [games, setGames] = useState<GameListModel[]>([]);

  const collection = useGameStore(useShallow((state) => state.collections.find((c) => c._id === id)));

  useEffect(() => {
    if (collection?.filters) {
      window.api.getCollectionGames(collection._id).then(setGames).catch(console.error);
    }
  }, [collection?.filters]);

  if (!collection) {
    return <Title order={3}>{t("collection.notFound")}</Title>;
  }

  // TODO: Implement edit collection
  const onEditClick = () => {
    console.log("edit");
  };

  // TODO: Implement delete collection
  const onDeleteClick = () => {
    console.log("delete");
  };

  return (
    <div className={classes.container}>
      <Flex className={classes.header} justify="space-between">
        <Title order={1}>{collection.name}</Title>
        <Flex gap="4px">
          <ActionIcon
            aria-label={t("settingsButton.title")}
            className={classes.actionIcon}
            onClick={onEditClick}
            title={"delete"}
          >
            <IconEdit size={20} stroke={1} />
          </ActionIcon>
          <ActionIcon
            aria-label={t("settingsButton.title")}
            className={classes.actionIcon}
            onClick={onDeleteClick}
            title={"delete"}
          >
            <IconTrash size={20} stroke={1} />
          </ActionIcon>
        </Flex>
      </Flex>
      <GamesGrid games={games} />
    </div>
  );
};

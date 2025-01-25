import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameListModel } from "@contracts/database/games";
import { ActionIcon, Flex, Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconDeviceGamepad, IconEdit, IconTrash } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

export const CollectionView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [games, setGames] = useState<GameListModel[]>([]);
  const { collection, fetchCollectionGames, gamesList } = useGameStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      fetchCollectionGames: state.fetchCollectionGames,
      gamesList: state.collectionsCache[id!],
    })),
  );

  const Icon = useMemo(() => {
    if (!collection?.icon) return IconDeviceGamepad;

    return importDynamicIcon(collection.icon, IconDeviceGamepad);
  }, [collection?.icon]);

  useEffect(() => {
    if (!gamesList) {
      fetchCollectionGames(id!).then(setGames);
    } else {
      setGames(gamesList);
    }
  }, []);

  if (!collection) {
    return <Title order={3}>{t("collection.notFound")}</Title>;
  }

  const onDeleteConfirm = async () => {
    await window.api.deleteCollection(collection._id);
    navigate("/desktop/library");
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      children: <Text size="sm">Are you sure you want to delete this collection? This action is irreversible.</Text>,
      labels: { cancel: "Cancel", confirm: "Delete" },
      onConfirm: () => onDeleteConfirm(),
      size: "sm",
      title: `Delete ${collection.name} collection`,
    });

  const onEditClick = () => {
    // TODO: Implement edit collection.
    // ...
    // Bust the cache, refresh the games list.
    // delete comment once edit has been implemented.
    fetchCollectionGames(id!, { forceFetch: true }).then(setGames);
    console.log("edit");
  };

  return (
    <div className={classes.container}>
      <Flex className={classes.header} justify="space-between">
        <Group align="center" gap="sm">
          <Icon size={40} />
          <Title order={1}>{collection.name}</Title>
        </Group>
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
            onClick={() => openDeleteModal()}
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

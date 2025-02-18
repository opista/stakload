import { CollectionTitle } from "@components/Desktop/CollectionTitle/CollectionTitle";
import { FilterControl } from "@components/Desktop/FilterControl/FilterControl";
import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameFilters } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { ActionIcon, Group, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

export const CollectionView = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const { collection, deleteCollection } = useCollectionStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      deleteCollection: state.deleteCollection,
    })),
  );
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));

  const [filters, setFilters] = useState<GameFilters>({ ...collection?.filters });

  const { data: games = [] } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
    setFilters({ ...collection?.filters });
  }, [id]);

  if (!collection) {
    return <Title order={3}>{t("collection.notFound")}</Title>;
  }

  const onDeleteConfirm = async () => {
    await deleteCollection(collection._id);
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

  return (
    <div className={classes.container} ref={containerRef}>
      <SectionHeading direction="column" gap="md">
        <Group align="center" gap="sm" justify="space-between">
          {collection && <CollectionTitle collection={collection} />}
          <Group align="center" gap="sm" wrap="wrap">
            <ActionIcon
              aria-label={t("settingsButton.title")}
              className={classes.actionIcon}
              onClick={() => openDeleteModal()}
              title={"delete"}
            >
              <IconTrash size={20} stroke={1} />
            </ActionIcon>
          </Group>
        </Group>
        <FilterControl collection={collection} onChange={setFilters} />
      </SectionHeading>
      <GamesGrid games={games} />
    </div>
  );
};

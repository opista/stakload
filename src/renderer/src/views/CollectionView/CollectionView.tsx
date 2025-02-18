import { FilterControl } from "@components/Desktop/FilterControl/FilterControl";
import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { EditableField } from "@components/EditableField/EditableField";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { IconSelector } from "@components/IconSelector/IconSelector";
import { GameFilters } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { ActionIcon, Group, Text, Title, TitleProps, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconDeviceGamepad, IconTrash } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import clsx from "clsx";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

// TODO: Refactor this into it's own component.
const CollectionTitle = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => (
  <Title {...props} className={clsx(classes.title, { [classes.active]: props["data-active"] })} order={1} ref={ref} />
));

CollectionTitle.displayName = "CollectionTitle";

export const CollectionView = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const { collection, deleteCollection, updateCollection } = useCollectionStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      deleteCollection: state.deleteCollection,
      updateCollection: state.updateCollection,
    })),
  );
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));

  const [filters, setFilters] = useState<GameFilters>({ ...collection?.filters });

  const { data: games = [] } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  const onTitleUpdate = (value: string) => {
    if (!collection || !value) return;

    updateCollection(collection._id, { name: value, filters: collection?.filters });
  };

  const onIconSelect = (iconName: string) => {
    if (!collection || !iconName) return;

    updateCollection(collection._id, {
      name: collection.name,
      icon: iconName,
      filters: collection.filters,
    });
  };

  const Icon = useMemo(() => {
    if (!collection?.icon) return IconDeviceGamepad;

    return importDynamicIcon(collection.icon, IconDeviceGamepad);
  }, [collection?.icon]);

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
          <Group>
            <IconSelector onSelect={onIconSelect} selectedIcon={collection.icon}>
              <Tooltip arrowSize={8} label="Change icon" offset={10} position="right" withArrow>
                <Icon size={40} />
              </Tooltip>
            </IconSelector>
            <EditableField
              as={CollectionTitle}
              label="Edit collection name"
              maxLength={30}
              onBlur={onTitleUpdate}
              value={collection.name}
            />
          </Group>
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
        <FilterControl collection={collection} />
      </SectionHeading>
      <GamesGrid games={games} />
    </div>
  );
};

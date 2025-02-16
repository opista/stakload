import { EditableField } from "@components/EditableField/EditableField";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { IconSelector } from "@components/IconSelector/IconSelector";
import { GameListModel } from "@contracts/database/games";
import { ActionIcon, Flex, Group, Pill, Text, Title, TitleProps, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconDeviceGamepad, IconTrash } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import clsx from "clsx";
import { forwardRef, useEffect, useMemo, useState } from "react";
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
  const { id } = useParams();
  const { t } = useTranslation();
  const [games, setGames] = useState<GameListModel[]>([]);
  const { collection, fetchCollectionGames, collectionGames, updateCollection } = useGameStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      collectionGames: state.collectionsCache[id!],
      fetchCollectionGames: state.fetchCollectionGames,
      updateCollection: state.updateCollection,
    })),
  );

  console.log(collection?.filters);

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
    // TODO: Add loading state.
    if (!collectionGames) {
      fetchCollectionGames(id!).then(setGames);
    } else {
      setGames(collectionGames);
    }
  }, [id]);

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

  return (
    <div className={classes.container}>
      <Flex className={classes.header} justify="space-between">
        <Group align="center" gap="sm">
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
        <Flex gap="4px">
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
      <Flex>
        {/* TODO: We need to get the "pretty" tags for these,
        they're just a bunch of IDs right now. Maybe we can store
        the pretty tags in the collection object? */}
        {Object.values(collection.filters).flatMap((value) => (
          <Pill key={value.toString()}>{value.toString()}</Pill>
        ))}
      </Flex>
      <GamesGrid games={games} />
    </div>
  );
};

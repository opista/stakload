import { GamesFilter } from "@components/GamesFilter/GamesFilter";
import { CollectionStoreModel } from "@contracts/database/collections";
import { GameFilters } from "@contracts/database/games";
import { useLibraryFilters } from "@hooks/use-game-filters";
import { ActionIcon, Divider, Group, Pill } from "@mantine/core";
import { useCollectionStore } from "@store/collection.store";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import classes from "./FilterControl.module.css";

type FilterControlProps = {
  collection?: CollectionStoreModel;
  onChange?: (filters: GameFilters) => void;
  onCreate?: () => void;
};

export const FilterControl = ({ collection, onChange, onCreate }: FilterControlProps) => {
  const [filters, setFilters] = useState<GameFilters>(collection?.filters || {});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const updateCollection = useCollectionStore(useShallow((state) => state.updateCollection));
  const { formattedFilters } = useLibraryFilters(filters);

  useEffect(() => {
    setFilters(collection?.filters || {});
    setHasUnsavedChanges(false);
  }, [collection]);

  const onRemove = (key: string, value: string) => {
    setHasUnsavedChanges(true);
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [key]: key === "isInstalled" ? undefined : prev?.[key]?.filter((v) => v !== value),
      };
      onChange?.(updatedFilters);
      return updatedFilters;
    });
  };

  const onUpdate = (filters: GameFilters) => {
    setHasUnsavedChanges(true);
    setFilters(filters);
    onChange?.(filters);
  };

  const onSave = async () => {
    if (!collection) return;

    await updateCollection(collection._id, {
      filters,
      icon: collection.icon,
      name: collection.name,
    });

    setHasUnsavedChanges(false);
  };

  return (
    <Group align="start" gap="sm">
      <GamesFilter filters={filters} onChange={onUpdate} />

      {formattedFilters.length && <Divider className={classes.divider} orientation="vertical" />}

      <Group className={classes.pillContainer} gap="xs">
        {formattedFilters.map(({ key, label, value }) => (
          <Pill className={classes.pill} key={value} onRemove={() => onRemove(key, value)} size="md" withRemoveButton>
            {label}
          </Pill>
        ))}
        {/* TODO: Make these buttons fit the theme */}
        {hasUnsavedChanges && collection && formattedFilters.length && (
          <ActionIcon color="blue" onClick={onSave} variant="filled">
            <IconDeviceFloppy size={20} stroke={1} />
          </ActionIcon>
        )}
        {hasUnsavedChanges && !collection && formattedFilters.length && (
          <ActionIcon color="blue" onClick={onCreate} variant="filled">
            <IconDeviceFloppy size={20} stroke={1} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
};

import { Separator } from "@base-ui/react";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { GamesFilter } from "@components/game/games-filter";
import { ActionIcon } from "@components/ui/action-icon";
import { Badge } from "@components/ui/badge";
import { useLibraryFilters } from "@hooks/use-game-filters";
import { CollectionStoreModel } from "@stakload/contracts/database/collections";
import { GameFilters } from "@stakload/contracts/database/games";
import { useCollectionStore } from "@store/collection.store";

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
      name: collection.name,
    });

    setHasUnsavedChanges(false);
  };

  return (
    <div className="flex items-start gap-4">
      <GamesFilter filters={filters} onChange={onUpdate} />

      {formattedFilters.length > 0 && <Separator orientation="vertical" className="h-full w-px bg-white/10" />}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {formattedFilters.map(({ key, label, value }) => (
          <Badge key={String(value)} variant="filled" className="flex items-center gap-2 pr-1">
            <span className="max-w-[150px] truncate">{label}</span>
            <button onClick={() => onRemove(key, String(value))} className="rounded-full p-0.5 hover:bg-black/20">
              <IconX size={12} />
            </button>
          </Badge>
        ))}
        {hasUnsavedChanges && collection && formattedFilters.length > 0 && (
          <ActionIcon
            onClick={onSave}
            variant="filled"
            className="bg-cyan-500 hover:bg-cyan-400"
            aria-label="Save collection"
          >
            <IconDeviceFloppy size={20} stroke={2} />
          </ActionIcon>
        )}
        {hasUnsavedChanges && !collection && formattedFilters.length > 0 && (
          <ActionIcon
            onClick={onCreate}
            variant="filled"
            className="bg-cyan-500 hover:bg-cyan-400"
            aria-label="Create collection"
          >
            <IconDeviceFloppy size={20} stroke={2} />
          </ActionIcon>
        )}
      </div>
    </div>
  );
};

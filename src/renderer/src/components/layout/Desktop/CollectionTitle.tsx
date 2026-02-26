import { PageTitle } from "@components/layout/PageTitle";
import { EditableField } from "@components/ui/EditableField";
import { Tooltip } from "@components/ui/Tooltip";
import { useCollectionStore } from "@store/collection.store";
import { IconDeviceGamepad } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { CollectionStoreModel } from "../../../ipc.types";

import { IconSelector } from "./IconSelector";

type CollectionTitleProps = {
  collection: CollectionStoreModel;
};

export const CollectionTitle = ({ collection }: CollectionTitleProps) => {
  const updateCollection = useCollectionStore(useShallow((state) => state.updateCollection));

  const onIconSelect = async (iconName: string) => {
    if (!iconName) return;

    await updateCollection(collection._id, {
      filters: collection.filters,
      icon: iconName,
      name: collection.name,
    });
  };

  const onTitleUpdate = async (value: string) => {
    if (!collection || !value) return;

    await updateCollection(collection._id, { filters: collection.filters, name: value });
  };

  const Icon = useMemo(() => importDynamicIcon(collection.icon) || IconDeviceGamepad, [collection.icon]);

  return (
    <div className="flex items-center gap-4">
      <IconSelector onSelect={onIconSelect} selectedIcon={collection.icon}>
        <Tooltip label="Change icon" position="right">
          <Icon className="cursor-pointer" size={40} />
        </Tooltip>
      </IconSelector>
      <EditableField
        as={PageTitle}
        label="Edit collection name"
        maxLength={30}
        onBlur={onTitleUpdate}
        value={collection.name}
      />
    </div>
  );
};


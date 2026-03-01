import { PageTitle } from "@components/layout/page-title";
import { EditableField } from "@components/ui/editable-field";
import { useCollectionStore } from "@store/collection.store";
import { useShallow } from "zustand/react/shallow";

import { CollectionStoreModel } from "../../../ipc.types";

type CollectionTitleProps = {
  collection: CollectionStoreModel;
};

export const CollectionTitle = ({ collection }: CollectionTitleProps) => {
  const updateCollection = useCollectionStore(useShallow((state) => state.updateCollection));

  const onTitleUpdate = async (value: string) => {
    if (!collection || !value) return;

    await updateCollection(collection._id, { filters: collection.filters, name: value });
  };

  return (
    <EditableField
      as={PageTitle}
      label="Edit collection name"
      maxLength={30}
      onBlur={onTitleUpdate}
      value={collection.name}
    />
  );
};

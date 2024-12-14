import { CollectionStoreModel } from "@contracts/database/collections";
import { useCollectionsQuery } from "@hooks/use-collections-query";
import { Select } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

type CollectionSelectProps = {
  className?: string;
};

export const CollectionSelect = ({ className }: CollectionSelectProps) => {
  const { data: collections = [] } = useCollectionsQuery<CollectionStoreModel[]>(() => window.api.getCollections());
  const { resetFilters, selectedCollection, setSelectedCollection, setMultipleFilters } = useGameStore(
    useShallow((state) => ({
      resetFilters: state.resetFilters,
      selectedCollection: state.selectedCollection,
      setSelectedCollection: state.setSelectedCollection,
      setMultipleFilters: state.setMultipleFilters,
    })),
  );

  const defaultCollection = {
    label: "All games",
    value: "",
  };

  const allCollections = collections.reduce(
    (acc, collection) => {
      return [
        ...acc,
        {
          label: collection.name,
          value: collection._id,
        },
      ];
    },
    [defaultCollection],
  );

  const onChange = (val: string | null) => {
    if (val === null) return;

    if (!val) {
      setSelectedCollection("");
      resetFilters();
      return;
    }

    const collection = collections.find(({ _id }) => val === _id);
    if (!collection) {
      setSelectedCollection("");
      resetFilters();
      return;
    }

    setSelectedCollection(val);
    setMultipleFilters(collection.filters);
  };

  return (
    <Select
      allowDeselect={false}
      className={className}
      comboboxProps={{ position: "bottom-start", width: "auto" }}
      data={allCollections}
      defaultValue={null}
      onChange={onChange}
      value={selectedCollection}
    />
  );
};

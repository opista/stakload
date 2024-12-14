import { CollectionStoreModel } from "@contracts/database/collections";
import { useCollectionsQuery } from "@hooks/use-collections-query";
import { Select } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

type CollectionSelectProps = {
  className?: string;
  value?: string | null;
};

export const CollectionSelect = ({ className, value }: CollectionSelectProps) => {
  const { data: collections = [] } = useCollectionsQuery<CollectionStoreModel[]>(() => window.api.getCollections());
  const { resetFilters, setMultipleFilters } = useGameStore(
    useShallow((state) => ({
      resetFilters: state.resetFilters,
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

  const onChange = (value: string | null) => {
    if (!value) {
      resetFilters();
      return;
    }

    const collection = collections.find(({ _id }) => value === _id);
    if (!collection) {
      resetFilters();
      return;
    }

    setMultipleFilters(collection.filters);
  };

  return (
    <Select
      allowDeselect={false}
      className={className}
      data={allCollections}
      defaultValue={null}
      onChange={onChange}
      value={value}
    />
  );
};

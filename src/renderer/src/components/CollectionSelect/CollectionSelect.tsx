import { Select } from "@mantine/core";

type CollectionSelectProps = {
  className?: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
};

export const CollectionSelect = ({ className, onChange, value }: CollectionSelectProps) => {
  // TODO
  const collections = [];

  const defaultCollection = {
    label: "All games",
    value: "",
  };

  const allCollections = [defaultCollection, ...collections];

  return (
    <Select
      allowDeselect={false}
      className={className}
      data={allCollections}
      defaultValue={null}
      onChange={(value) => onChange?.(value)}
      value={value}
    />
  );
};

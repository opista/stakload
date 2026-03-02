import { useState } from "react";

import { Button } from "@components/ui/button";
import { Modal } from "@components/ui/modal";
import { TextInput } from "@components/ui/text-input";

type CollectionCreateModalProps = {
  onClose: () => void;
  onConfirm: (name: string) => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onClose, onConfirm, opened }: CollectionCreateModalProps) => {
  const [value, setValue] = useState<string>("");

  const onClickConfirm = () => onConfirm(value);

  return (
    <Modal centered onClose={onClose} opened={opened} size="lg" title="Save collection">
      <TextInput
        className="mb-6"
        label="Collection name"
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Enter collection name..."
        value={value}
      />

      <div className="flex justify-end gap-3">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button disabled={!value} onClick={onClickConfirm}>
          Create collection
        </Button>
      </div>
    </Modal>
  );
};

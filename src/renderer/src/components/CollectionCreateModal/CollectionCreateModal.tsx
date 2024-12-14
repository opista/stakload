import { Button, Flex, Modal, TextInput } from "@mantine/core";
import { useState } from "react";

type RemoveGameModalProps = {
  onConfirm: (value: string) => void;
  onClose: () => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onConfirm, onClose, opened }: RemoveGameModalProps) => {
  const [value, setValue] = useState<string>("");

  const onClickConfirm = () => onConfirm(value);

  return (
    <Modal centered onClose={onClose} opened={opened} size="sm" title={`Save collection`}>
      <TextInput label="Collection name" value={value} onChange={(event) => setValue(event.currentTarget.value)} />
      <Flex gap="xs" mt="sm" justify="flex-end">
        <Button disabled={!value} onClick={onClickConfirm}>
          Create collection
        </Button>
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
      </Flex>
    </Modal>
  );
};

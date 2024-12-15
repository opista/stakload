import { Button, Flex, Modal, TextInput } from "@mantine/core";
import { useState } from "react";

type RemoveGameModalProps = {
  onClose: () => void;
  onConfirm: (value: string) => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onConfirm, onClose, opened }: RemoveGameModalProps) => {
  const [value, setValue] = useState<string>("");

  const onClickConfirm = () => onConfirm(value);

  return (
    <Modal centered onClose={onClose} opened={opened} size="sm" title={`Save collection`}>
      <TextInput label="Collection name" onChange={(event) => setValue(event.currentTarget.value)} value={value} />
      <Flex gap="xs" justify="flex-end" mt="sm">
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

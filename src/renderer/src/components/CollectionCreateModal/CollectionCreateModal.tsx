import { Button, Flex, Modal, ScrollArea, TextInput } from "@mantine/core";
import { useState } from "react";

import IconSelector from "../IconSelector";

type CollectionCreateModalProps = {
  onClose: () => void;
  onConfirm: (name: string, icon?: string) => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onConfirm, onClose, opened }: CollectionCreateModalProps) => {
  const [value, setValue] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>();

  const onClickConfirm = () => onConfirm(value, selectedIcon);

  return (
    <Modal centered onClose={onClose} opened={opened} size="lg" title="Save collection">
      <TextInput
        label="Collection name"
        mb="md"
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      />

      <ScrollArea h={400} mb="md">
        <IconSelector onSelect={setSelectedIcon} selectedIcon={selectedIcon} />
      </ScrollArea>

      <Flex gap="xs" justify="flex-end">
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

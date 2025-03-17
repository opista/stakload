import { IconSelector } from "@components/Desktop/IconSelector/IconSelector";
import { ActionIcon, Button, Flex, Modal, ScrollArea, TextInput } from "@mantine/core";
import { IconDeviceGamepad } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { useMemo, useState } from "react";

type CollectionCreateModalProps = {
  onClose: () => void;
  onConfirm: (name: string, icon?: string) => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onConfirm, onClose, opened }: CollectionCreateModalProps) => {
  const [value, setValue] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("IconDeviceGamepad");

  const onClickConfirm = () => onConfirm(value, selectedIcon);

  const Icon = useMemo(() => importDynamicIcon(selectedIcon) || IconDeviceGamepad, [selectedIcon]);

  return (
    <Modal centered onClose={onClose} opened={opened} size="lg" title="Save collection">
      <TextInput
        label="Collection name"
        mb="md"
        onChange={(event) => setValue(event.currentTarget.value)}
        value={value}
      />

      <ScrollArea h={400} mb="md">
        <IconSelector onSelect={setSelectedIcon} selectedIcon={selectedIcon}>
          <ActionIcon variant="default">
            <Icon size={40} />
          </ActionIcon>
        </IconSelector>
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

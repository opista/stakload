import ActionIcon from "@components/ActionIcon/ActionIcon";
import { Button } from "@components/Button/Button";
import { IconSelector } from "@components/Desktop/IconSelector/IconSelector";
import { Modal } from "@components/Modal/Modal";
import { TextInput } from "@components/TextInput/TextInput";
import { IconDeviceGamepad } from "@tabler/icons-react";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { useMemo, useState } from "react";

type CollectionCreateModalProps = {
  onClose: () => void;
  onConfirm: (name: string, icon?: string) => void;
  opened: boolean;
};

export const CollectionCreateModal = ({ onClose, onConfirm, opened }: CollectionCreateModalProps) => {
  const [value, setValue] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<string>("IconDeviceGamepad");

  const onClickConfirm = () => onConfirm(value, selectedIcon);

  const Icon = useMemo(() => importDynamicIcon(selectedIcon) || IconDeviceGamepad, [selectedIcon]);

  return (
    <Modal centered onClose={onClose} opened={opened} size="lg" title="Save collection">
      <TextInput
        className="mb-6"
        label="Collection name"
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Enter collection name..."
        value={value}
      />

      <div className="mb-6 h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        <IconSelector onSelect={setSelectedIcon} selectedIcon={selectedIcon}>
          <ActionIcon aria-label="Select icon" variant="default" size="xl">
            <Icon size={40} />
          </ActionIcon>
        </IconSelector>
      </div>

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

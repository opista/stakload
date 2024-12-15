import ActionIcon from "@components/ActionIcon/ActionIcon";
import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPower } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { PowerModal } from "../PowerModal/PowerModal";

const shortcut = SHORTCUT_KEYS.QUIT.join("+");

export const PowerControl = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  const openPowerControlModal = () => {
    modals.closeAll();
    open();
  };

  useHotkeys([[shortcut, openPowerControlModal]]);

  return (
    <>
      <ActionIcon
        aria-label={t("quit")}
        icon={IconPower}
        onClick={openPowerControlModal}
        title={t("shortcutWithValue", { value: shortcut })}
      />

      <PowerModal onClose={close} opened={opened} />
    </>
  );
};

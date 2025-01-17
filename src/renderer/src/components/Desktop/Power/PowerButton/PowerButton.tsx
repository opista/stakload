import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { ActionIcon } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPower } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { PowerModal } from "../PowerModal/PowerModal";
import classes from "./PowerButton.module.css";

const shortcut = SHORTCUT_KEYS.QUIT.join("+");

export const PowerButton = () => {
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
        aria-label={t("power.quit")}
        className={classes.actionIcon}
        onClick={openPowerControlModal}
        title={t("settingsButton.shortcutWithValue", { value: shortcut })}
      >
        <IconPower className={classes.icon} stroke={1} />
      </ActionIcon>

      <PowerModal onClose={close} opened={opened} />
    </>
  );
};

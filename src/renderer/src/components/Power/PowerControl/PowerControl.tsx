import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { IconPower } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { PowerModal } from "../PowerModal/PowerModal";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";

const shortcut = SHORTCUT_KEYS.QUIT.join("+");

export const PowerControl = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useHotkeys([[shortcut, open]]);

  return (
    <>
      <ActionIcon
        aria-label={t("quit")}
        icon={IconPower}
        onClick={open}
        title={t("shortcutWithValue", { value: shortcut })}
      />

      <PowerModal onClose={close} opened={opened} />
    </>
  );
};

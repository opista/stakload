import { ActionIcon, VisuallyHidden } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { IconPower } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SHORTCUT_KEYS } from "../../constants/shortcuts";

const shortcut = SHORTCUT_KEYS.QUIT.join("+");

export const ApplicationControl = () => {
  // TODO, this should open a modal to close the app, shut down or put PC to sleep
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useHotkeys([[shortcut, open]]);

  return (
    <>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label={t("quit")}
        title={t("shortcutWithValue", { value: shortcut })}
        onClick={open}
      >
        <VisuallyHidden>{t("quit")}</VisuallyHidden>
        <IconPower style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </>
  );
};

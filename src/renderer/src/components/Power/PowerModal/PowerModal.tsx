import { Button, Divider, Modal, Stack } from "@mantine/core";
import { IconPower, IconRefresh, IconRotateClockwise2, IconX, IconZzz } from "@tabler/icons-react";
import classes from "./PowerModal.module.css";
import { useTranslation } from "react-i18next";
import { power } from "@api/index";

interface PowerModalProps {
  onClose: () => void;
  opened: boolean;
}

export const PowerModal = ({ onClose, opened }: PowerModalProps) => {
  const { t } = useTranslation();

  const appPowerControls = [
    {
      onClick: () => power.closeApp(),
      Icon: IconX,
      label: t("power.closeApp"),
    },
    {
      onClick: () => power.restartApp(),
      Icon: IconRotateClockwise2,
      label: t("power.restartApp"),
    },
  ];

  const devicePowerControls = [
    {
      onClick: () => power.shutdownDevice(),
      Icon: IconPower,
      label: t("power.shutdown"),
    },
    {
      onClick: () => power.restartDevice(),
      Icon: IconRefresh,
      label: t("power.restart"),
    },
    {
      onClick: () => power.sleepDevice(),
      Icon: IconZzz,
      label: t("power.sleep"),
    },
  ];

  return (
    <Modal opened={opened} onClose={onClose} size="auto" title="Power">
      <Stack gap="xs">
        {appPowerControls.map(({ Icon, label, onClick }) => (
          <Button
            classNames={{
              label: classes.buttonLabel,
            }}
            justify="space-between"
            key={label}
            leftSection={<Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />}
            onClick={onClick}
            variant="default"
          >
            {label}
          </Button>
        ))}
        <Divider className={classes.divider} />
        {devicePowerControls.map(({ Icon, label, onClick }) => (
          <Button
            classNames={{
              label: classes.buttonLabel,
            }}
            justify="space-between"
            key={label}
            leftSection={<Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />}
            onClick={onClick}
            variant="default"
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Modal>
  );
};

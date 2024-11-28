import { Button, Divider, Modal, Stack } from "@mantine/core";
import { IconDeviceGamepad2, IconPower, IconRefresh, IconRotateRectangle, IconX, IconZzz } from "@tabler/icons-react";
import classes from "./PowerModal.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface PowerModalProps {
  onClose: () => void;
  opened: boolean;
}

export const PowerModal = ({ onClose, opened }: PowerModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const appPowerControls = [
    {
      onClick: () => window.api.closeApp(),
      Icon: IconX,
      label: t("power.closeApp"),
    },
    {
      onClick: () => window.api.restartApp(),
      Icon: IconRotateRectangle,
      label: t("power.restartApp"),
    },
    {
      onClick: () => navigate("/gaming"),
      Icon: IconDeviceGamepad2,
      label: t("power.switchToGaming"),
    },
  ];

  const devicePowerControls = [
    {
      onClick: () => window.api.shutdownDevice(),
      Icon: IconPower,
      label: t("power.shutdown"),
    },
    {
      onClick: () => window.api.restartDevice(),
      Icon: IconRefresh,
      label: t("power.restart"),
    },
    {
      onClick: () => window.api.sleepDevice(),
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

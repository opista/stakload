import { CloseButton, Container, Modal, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { SettingsNavBar } from "../SettingsNavBar/SettingsNavBar";
import classes from "./SettingsModal.module.css";

type SettingsModalProps = {
  onClose: () => void;
  opened: boolean;
};

export const SettingsModal = ({ onClose, opened }: SettingsModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      padding={"sm"}
    >
      <header className={classes.header}>
        <Container className={classes.headerInner}>
          <Title order={3}>{t("settings")}</Title>
          <CloseButton onClick={onClose} />
        </Container>
      </header>
      <SettingsNavBar />
    </Modal>
  );
};

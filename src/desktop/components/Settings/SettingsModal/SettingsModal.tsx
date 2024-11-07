import { CloseButton, Container, Modal, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { SettingsNavBar } from "../SettingsNavBar/SettingsNavBar";
import classes from "./SettingsModal.module.css";
import { InterfaceSettingsView } from "../InterfaceSettingsView/InterfaceSettingsView";
import { AboutSettingsView } from "../AboutSettingsView/AboutSettingsView";

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
      padding="sm"
      size="auto"
    >
      <header className={classes.header}>
        <Container className={classes.headerInner}>
          <Title order={3}>{t("settings")}</Title>
          <CloseButton onClick={onClose} />
        </Container>
      </header>
      <div className={classes.container}>
        <SettingsNavBar />
        <main className={classes.main}>
          <Container fluid size="sm" m={0}>
            <InterfaceSettingsView />
          </Container>
        </main>
      </div>
    </Modal>
  );
};

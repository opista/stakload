import { Button, Checkbox, Flex, Modal, Text } from "@mantine/core";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import classes from "./RemoveGameModal.module.css";

type RemoveGameModalProps = {
  gameTitle: string;
  onClose: () => void;
  onConfirm: (preventReadd: boolean) => void;
  opened: boolean;
};

export const RemoveGameModal = ({ gameTitle, onConfirm, onClose, opened }: RemoveGameModalProps) => {
  const [preventReadd, setPreventReadd] = useState(false);
  const { t } = useTranslation();

  const onClickConfirm = () => onConfirm(preventReadd);

  return (
    <Modal centered onClose={onClose} opened={opened} size="sm" title={`Remove game from library`}>
      <Text className={classes.text}>
        <Trans i18nKey="removeGameModal.areYouSure" values={{ gameTitle }}></Trans>
      </Text>
      <Text className={classes.text}>{t("removeGameModal.installedInfo")}</Text>
      <Checkbox
        checked={preventReadd}
        label={t("removeGameModal.preventReadd")}
        onChange={(event) => setPreventReadd(event.currentTarget.checked)}
      />
      <Flex className={classes.buttonContainer} gap="xs" justify="flex-end">
        <Button color="red" onClick={onClickConfirm}>
          {t("removeGameModal.removeGame")}
        </Button>
        <Button onClick={onClose} variant="default">
          {t("removeGameModal.cancel")}
        </Button>
      </Flex>
    </Modal>
  );
};

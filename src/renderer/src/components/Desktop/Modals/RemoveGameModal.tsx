import { Button, Checkbox, Flex, Text } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./RemoveGameModal.module.css";

type RemoveGameModalProps = {
  id: string;
  name: string;
  navigateTo?: string;
};

export const RemoveGameModal = ({
  context,
  id: modalId,
  innerProps: { id, name, navigateTo },
}: ContextModalProps<RemoveGameModalProps>) => {
  const [preventReadd, setPreventReadd] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { archiveGame, deleteGame } = useGameStore(
    useShallow((state) => ({
      archiveGame: state.archiveGame,
      deleteGame: state.deleteGame,
    })),
  );

  const onConfirm = async () => {
    if (preventReadd) {
      await archiveGame(id);
    } else {
      await deleteGame(id);
    }
    context.closeModal(modalId);

    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const onClose = () => context.closeModal(modalId);

  return (
    <>
      <Text className={classes.text}>
        <Trans i18nKey="removeGameModal.areYouSure" values={{ name }}></Trans>
      </Text>
      <Text className={classes.text}>{t("removeGameModal.installedInfo")}</Text>
      <Checkbox
        checked={preventReadd}
        label={t("removeGameModal.preventReadd")}
        onChange={(event) => setPreventReadd(event.currentTarget.checked)}
      />
      <Flex className={classes.buttonContainer} gap="xs" justify="flex-end">
        <Button color="red" onClick={onConfirm}>
          {t("removeGameModal.removeGame")}
        </Button>
        <Button onClick={onClose} variant="default">
          {t("removeGameModal.cancel")}
        </Button>
      </Flex>
    </>
  );
};

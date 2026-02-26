import { Button } from "@components/Button/Button";
import { Checkbox } from "@components/Checkbox/Checkbox";
import { Modal } from "@components/Modal/Modal";
import { useGameStore } from "@store/game.store";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

type RemoveGameModalProps = {
  opened: boolean;
  onClose: () => void;
  innerProps: {
    id: string;
    name: string;
    navigateTo?: string;
  };
};

export const RemoveGameModal = ({ innerProps: { id, name, navigateTo }, onClose, opened }: RemoveGameModalProps) => {
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

    onClose();

    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("removeGameModal.title")} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium leading-relaxed text-neutral-200">
            <Trans i18nKey="removeGameModal.areYouSure" values={{ name }}></Trans>
          </p>
          <p className="text-sm font-medium leading-relaxed text-neutral-200">{t("removeGameModal.installedInfo")}</p>
        </div>
        <Checkbox
          checked={preventReadd}
          label={t("removeGameModal.preventReadd")}
          onChange={(event) => setPreventReadd(event.currentTarget.checked)}
        />
        <div className="mt-4 flex justify-end gap-3">
          <Button onClick={onClose} variant="default">
            {t("removeGameModal.cancel")}
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {t("removeGameModal.removeGame")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

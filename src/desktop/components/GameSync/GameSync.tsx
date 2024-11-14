import { useEffect, useMemo, useState } from "react";
import { useWorker } from "react-hooks-worker";
import { UnstyledButton, Loader, Text, rem } from "@mantine/core";
import classes from "./GameSync.module.css";
import { GameSyncResult } from "../../../workers/game-sync.worker";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { db, GameStoreModel } from "../../../database";
import { useInterval } from "@mantine/hooks";

const createWorker = () =>
  new Worker(new URL("../../../workers/game-sync.worker.ts", import.meta.url), { type: "module" });

export const GameSync = () => {
  const { t } = useTranslation();
  const [gamesToSync, setGamesToSync] = useState<GameStoreModel[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { result } = useWorker<unknown, GameSyncResult>(
    createWorker,
    useMemo(() => ({ games: gamesToSync }), [gamesToSync]),
  );

  const interval = useInterval(async () => {
    if (!isSyncing) {
      const newGamesToSync = await db.games.where("metadataSyncedAt").equals(0).toArray();

      // Update gamesToSync if it differs from the current list
      if (JSON.stringify(newGamesToSync) !== JSON.stringify(gamesToSync)) {
        setGamesToSync(newGamesToSync);
      }
    }
  }, 10000);

  // Polling for new unsynced games
  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  // Handle worker result and notification
  useEffect(() => {
    if (result?.status === "COMPLETE") {
      setIsSyncing(false); // Allow next sync cycle
      notifications.show({
        autoClose: 8000,
        closeButtonProps: { "aria-label": t("hideNotification") },
        color: "green",
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        title: t("sync.syncComplete"),
        message: t("sync.gamesUpdated", { count: result.processed }),
        position: "bottom-right",
        withBorder: true,
        withCloseButton: true,
      });
    } else if (result?.status === "PROCESSING") {
      setIsSyncing(true);
    }
  }, [result]);

  if (!gamesToSync.length || !isSyncing) {
    return null;
  }

  return (
    <UnstyledButton className={classes.container}>
      <Loader className={classes.loader} size={24} />
      <div>
        <Text size="sm">{t("sync.syncing")}</Text>
        <Text size="xs">
          {t("sync.updatingLibrary", { processing: result?.processed, total: result?.total })}
        </Text>
      </div>
    </UnstyledButton>
  );
};

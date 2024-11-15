import { Loader, Text, Box, rem, Divider } from "@mantine/core";
import classes from "./GameSync.module.css";
import { useTranslation } from "react-i18next";
import { db, GameStoreModel } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { GameSyncResult } from "../../../workers/game-sync.worker";
import { useWorker } from "react-hooks-worker";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const createWorker = () =>
  new Worker(new URL("../../../workers/game-sync.worker.ts", import.meta.url), { type: "module" });

export const GameSync = () => {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [gamesToSync, setGamesToSync] = useState<GameStoreModel[]>([]);
  const games = useLiveQuery(
    () => db.games.where("metadataSyncedAt").equals(0).toArray(),
    [isSyncing],
  );
  const { result } = useWorker<unknown, GameSyncResult>(
    createWorker,
    useMemo(() => gamesToSync, [gamesToSync]),
  );

  useEffect(() => {
    if (!isSyncing && games?.length) {
      setIsSyncing(true);
      setGamesToSync(games);
    }
  }, [games]);

  useEffect(() => {
    if (result?.status === "COMPLETE") {
      setIsSyncing(false);
      setGamesToSync([]);
      notifications.show({
        autoClose: 8000,
        closeButtonProps: { "aria-label": t("hideNotification") },
        color: "green",
        icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
        title: t("sync.syncComplete"),
        message: t("sync.gamesUpdated", { count: result.total }),
        position: "bottom-right",
        withBorder: true,
        withCloseButton: true,
      });
    }
  }, [result?.status]);

  if (!games?.length || !isSyncing) {
    return null;
  }

  return (
    <>
      <Divider orientation="vertical" size="xs" />
      <Box className={classes.container}>
        <Loader className={classes.loader} size={24} type="bars" />
        <div>
          <Text size="sm">{t("sync.syncing")}</Text>
          <Text size="xs">
            {t("sync.updatingLibrary", {
              processing: result?.processing || 1,
              total: gamesToSync?.length,
            })}
          </Text>
        </div>
      </Box>
    </>
  );
};

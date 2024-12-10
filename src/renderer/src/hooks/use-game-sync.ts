import { GameSyncMessage } from "@contracts/store/game";
import { useEffect, useState } from "react";

enum SyncStatus {
  Cancelled = "cancelled",
  Complete = "complete",
  Inserted = "inserted",
  Processing = "processing",
  Waiting = "waiting",
}

type LikeSyncStatus = `${SyncStatus}`;

type SyncState = {
  processing: number;
  status: LikeSyncStatus;
  total: number;
};

const DEFAULT_STATE: SyncState = {
  processing: 0,
  status: SyncStatus.Waiting,
  total: 0,
};

export const useGameSync = () => {
  const [state, setState] = useState<SyncState>(DEFAULT_STATE);

  const processMessage =
    (status: SyncStatus) =>
    (_event: unknown, { processing, total }: GameSyncMessage) =>
      setState({
        processing,
        status,
        total,
      });

  useEffect(() => {
    const removeListener = window.api.onSyncInserted(processMessage(SyncStatus.Inserted));
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(processMessage(SyncStatus.Processing));
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncComplete(processMessage(SyncStatus.Complete));
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncQueueCleared(processMessage(SyncStatus.Cancelled));
    return () => removeListener();
  });

  return state;
};

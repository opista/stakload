import { useEffect, useReducer } from "react";

export enum SyncStatus {
  Cancelled = "cancelled",
  Complete = "complete",
  Inserted = "inserted",
  Processed = "processed",
  Waiting = "waiting",
}

type SyncState = {
  processed: number;
  status: SyncStatus;
  total: number;
};

type SyncAction = {
  status: SyncStatus;
  count?: number;
};

const DEFAULT_STATE: SyncState = {
  processed: 0,
  status: SyncStatus.Waiting,
  total: 0,
};

const syncStatusReducer = (state: SyncState, { status, count }: SyncAction): SyncState => {
  switch (status) {
    case SyncStatus.Cancelled:
    case SyncStatus.Complete:
      return {
        ...state,
        status,
      };
    case SyncStatus.Inserted:
      console.log(state, count);
      return {
        processed: state.processed || 1,
        status: SyncStatus.Processed,
        total: state.total + (count || 0),
      };
    case SyncStatus.Processed:
      if (state.status === SyncStatus.Cancelled) {
        return {
          processed: state.processed + 1,
          status: SyncStatus.Cancelled,
          total: state.total,
        };
      }
      return {
        processed: state.processed + 1,
        status,
        total: state.total,
      };
    case SyncStatus.Waiting:
    default:
      return DEFAULT_STATE;
  }
};

export const useGameSync = () => {
  const [state, dispatch] = useReducer(syncStatusReducer, DEFAULT_STATE);

  const onSyncCancelled = () => dispatch({ status: SyncStatus.Cancelled });
  const onSyncComplete = () => dispatch({ status: SyncStatus.Complete });
  const onSyncInserted = (count: number) => dispatch({ status: SyncStatus.Inserted, count });
  const onSyncProcessed = () => dispatch({ status: SyncStatus.Processed });

  useEffect(() => {
    const removeListener = window.api.onSyncInserted((_event, count) => onSyncInserted(count));
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(onSyncProcessed);
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncComplete(onSyncComplete);
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncQueueCleared(onSyncCancelled);
    return () => removeListener();
  });

  return state;
};

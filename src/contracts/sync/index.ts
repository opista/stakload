export enum GameSyncAction {
  Cancelled = "cancelled",
  Complete = "complete",
  Error = "error",
  Metadata = "metadata",
  Syncing = "syncing",
}

export enum GameSyncErrorCode {
  AlreadySyncing = "ALREADY_SYNCING",
  FetchFailed = "FETCH_FAILED",
  UnsupportedLibrary = "UNSUPPORTED_LIBRARY",
}

interface BaseSyncMessage {
  action: GameSyncAction;
}

export interface CancelledSyncMessage extends BaseSyncMessage {
  action: GameSyncAction.Cancelled;
}

export interface CompleteSyncMessage extends BaseSyncMessage {
  action: GameSyncAction.Complete;
  processed: number;
  total: number;
}

export interface ErrorSyncMessage extends BaseSyncMessage {
  action: GameSyncAction.Error;
  code: GameSyncErrorCode;
}

export interface MetadataSyncMessage extends BaseSyncMessage {
  action: GameSyncAction.Metadata;
  processing: number;
  total: number;
}

export interface LibrarySyncMessage extends BaseSyncMessage {
  action: GameSyncAction.Syncing;
  library: string;
}

export type GameSyncMessage =
  | LibrarySyncMessage
  | MetadataSyncMessage
  | CancelledSyncMessage
  | CompleteSyncMessage
  | ErrorSyncMessage;

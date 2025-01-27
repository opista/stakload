export type GameSyncAction = "syncing" | "metadata" | "complete" | "cancelled" | "error";

export enum GameSyncErrorCode {
  AlreadySyncing = "ALREADY_SYNCING",
  FetchFailed = "FETCH_FAILED",
  UnsupportedLibrary = "UNSUPPORTED_LIBRARY",
}

interface BaseSyncMessage {
  action: GameSyncAction;
}

export interface CancelledSyncMessage extends BaseSyncMessage {
  action: "cancelled";
}

export interface CompleteSyncMessage extends BaseSyncMessage {
  action: "complete";
  processed: number;
  total: number;
}

export interface ErrorSyncMessage extends BaseSyncMessage {
  action: "error";
  code: GameSyncErrorCode;
}

export interface MetadataSyncMessage extends BaseSyncMessage {
  action: "metadata";
  processing: number;
  total: number;
}

export interface LibrarySyncMessage extends BaseSyncMessage {
  action: "syncing";
  library: string;
}

export type GameSyncMessage =
  | LibrarySyncMessage
  | MetadataSyncMessage
  | CancelledSyncMessage
  | CompleteSyncMessage
  | ErrorSyncMessage;

import { Library } from "../database/games";

export type GameSyncAction = "complete" | "library" | "metadata";

interface BaseSyncMessage {
  action: GameSyncAction;
}
export interface CompleteSyncMessage extends BaseSyncMessage {
  action: "complete";
  hasFailures: boolean;
  total: number;
}

export interface LibrarySyncMessage extends BaseSyncMessage {
  action: "library";
  library: Library;
}

export interface MetadataSyncMessage extends BaseSyncMessage {
  action: "metadata";
  processing: number;
  total: number;
}

export type GameSyncMessage = CompleteSyncMessage | LibrarySyncMessage | MetadataSyncMessage;

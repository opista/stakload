import { Library } from "@stakload/contracts/database/games";

export interface FailureHistoryEntry {
  action: "library" | "install" | "metadata";
  code: "AUTHENTICATION_ERROR" | "UNKNOWN_ERROR" | "UNSUPPORTED_LIBRARY";
  gameName?: string;
  library?: Library;
}

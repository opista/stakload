import { LikeLibrary } from "@contracts/database/games";
import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { authenticateLibraryIntegration } from "../libraries/auth";

export const authenticateIntegration =
  (browserWindow: BrowserWindow) => (_event: IpcMainInvokeEvent, library: LikeLibrary) =>
    authenticateLibraryIntegration(library, browserWindow);

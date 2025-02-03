import { Library } from "@contracts/database/games";
import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { authenticateLibraryIntegration } from "../libraries/auth";

export const authenticateIntegration =
  (browserWindow: BrowserWindow) => (_event: IpcMainInvokeEvent, library: Library) =>
    authenticateLibraryIntegration(library, browserWindow);

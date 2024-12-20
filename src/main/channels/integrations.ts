import { LikeLibrary } from "@contracts/database/games";
import { BrowserWindow, IpcMainInvokeEvent } from "electron";

import { authenticateLibraryIntegration } from "../libraries/auth";
import { findAndInsertNewGames, isCredentialsValid } from "../libraries/steam/integration";

export const testSteamIntegration = (_event: IpcMainInvokeEvent, steamId: string, webApiKey: string) =>
  isCredentialsValid(steamId, webApiKey);

export const insertNewGames = (_event: IpcMainInvokeEvent, steamId: string, webApiKey: string) =>
  findAndInsertNewGames(steamId, webApiKey);

export const authenticateIntegration =
  (browserWindow: BrowserWindow) => (_event: IpcMainInvokeEvent, library: LikeLibrary) =>
    authenticateLibraryIntegration(library, browserWindow);

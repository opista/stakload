import { IpcMainInvokeEvent } from "electron";

import { findAndInsertNewGames, isCredentialsValid } from "../libraries/steam/integration";

export const testSteamIntegration = (_event: IpcMainInvokeEvent, steamId: string, webApiKey: string) =>
  isCredentialsValid(steamId, webApiKey);

export const insertNewGames = (_event: IpcMainInvokeEvent, steamId: string, webApiKey: string) =>
  findAndInsertNewGames(steamId, webApiKey);

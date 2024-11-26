import { IpcMainInvokeEvent } from "electron";
import { getOwnedGames } from "../libraries/steam";
import { isEmpty } from "lodash-es";

export const testSteamIntegration = async (_event: IpcMainInvokeEvent, steamId: string, webApiKey: string) => {
  console.log(_event.sender.id);

  try {
    const response = await getOwnedGames(webApiKey, steamId);

    if (isEmpty(response)) return false;

    return true;
  } catch (err) {
    // TODO - error logging
    console.log(err);
    return false;
  }
};

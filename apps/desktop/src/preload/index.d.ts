import { Library } from "@stakload/contracts/database/games";
import { GameSyncMessage } from "@stakload/contracts/store/game";
import { Notification } from "@stakload/contracts/store/notification";

import { RemoveListenerFunction } from "./util/listener-handler";

declare global {
  interface Window {
    api: {
      onGamesListUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onIntegrationAuthenticationResult: (
        listener: (event, data: { library: Library; success: boolean }) => void,
      ) => RemoveListenerFunction;
      onNotification: (listener: (event, data: Notification) => void) => RemoveListenerFunction;
      onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      platform: string;
    };
  }
}

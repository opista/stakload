import { GameSyncMessage } from "@contracts/store/game";
import { Notification } from "@contracts/store/notification";

import { RemoveListenerFunction } from "./util/listener-handler";

declare global {
  interface Window {
    api: {
      onGamesListUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onIntegrationAuthenticationResult: (
        listener: (event, { library: Library, success: boolean }) => void,
      ) => RemoveListenerFunction;
      onNotification: (listener: (event, data: Notification) => void) => RemoveListenerFunction;
      onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      platform: string;
    };
  }
}

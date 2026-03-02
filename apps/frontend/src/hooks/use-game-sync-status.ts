import { useEffect, useState } from "react";

import { GameSyncMessage } from "@stakload/contracts/sync";

export const useGameSync = () => {
  const [state, setState] = useState<GameSyncMessage | null>(null);

  const processMessage = (_event: unknown, message: GameSyncMessage) => setState(message);

  useEffect(() => {
    const removeListener = window.api.onSyncGameStatus(processMessage);
    return () => removeListener();
  }, []);

  return state;
};

import { GameState } from "@stakload/contracts/store/game";
import { IntegrationSettingsState } from "@stakload/contracts/store/integration-settings";

type PersistedGameState = Pick<GameState, "quickLaunchGamesOrder">;

export interface Config {
  games: { state: PersistedGameState };
  integration_settings: { state: IntegrationSettingsState };
}

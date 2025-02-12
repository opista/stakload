import { GameState } from "@contracts/store/game";
import { IntegrationSettingsState } from "@contracts/store/integration-settings";

type PersistedGameState = Pick<GameState, "quickLaunchGamesOrder">;

export interface Config {
  games: { state: PersistedGameState };
  integration_settings: { state: IntegrationSettingsState };
}

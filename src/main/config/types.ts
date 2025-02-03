import { GameState } from "@contracts/store/game";
import { IntegrationSettingsState } from "@contracts/store/integration-settings";
import { InterfaceSettingsState } from "@contracts/store/interface-settings";

type PersistedGameState = Pick<GameState, "quickLaunchGamesOrder">;

export interface Config {
  games: { state: PersistedGameState };
  integration_settings: { state: IntegrationSettingsState };
  interface_settings: { state: InterfaceSettingsState };
}

import { Library } from "@contracts/database/games";
import {
  Icon,
  IconBrandBattleNet,
  IconBrandEpicGames,
  IconBrandGog,
  IconBrandSteam,
  IconHelpHexagon,
} from "@icons/index";

export const mapLibraryIcon = (library: Library): { icon: Icon; name: string | null } => {
  switch (library) {
    case "battle-net":
      return { icon: IconBrandBattleNet, name: "Battle.net" };
    case "epic-game-store":
      return { icon: IconBrandEpicGames, name: "Epic Games" };
    case "gog":
      return { icon: IconBrandGog, name: "GOG" };
    case "steam":
      return { icon: IconBrandSteam, name: "Steam" };
    default:
      return { icon: IconHelpHexagon, name: null };
  }
};

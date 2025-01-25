import { LikeLibrary } from "@contracts/database/games";
import { IconBrandEpicGames } from "@icons/IconBrandEpicGames";
import { IconBrandGog } from "@icons/IconBrandGog";
import { Icon, IconBrandSteam, IconBrandWindows, IconBrandXbox, IconHelpHexagon } from "@tabler/icons-react";

export const mapLibraryIcon = (library: LikeLibrary): { icon: Icon; name: string | null } => {
  switch (library) {
    case "epic-game-store":
      return { icon: IconBrandEpicGames, name: "Epic Games" };
    case "gog":
      return { icon: IconBrandGog, name: "GOG" };
    case "microsoft":
      return { icon: IconBrandWindows, name: "Microsoft" };
    case "steam":
      return { icon: IconBrandSteam, name: "Steam" };
    case "xbox-game-pass-ultimate-cloud":
      return { icon: IconBrandXbox, name: "Xbox Game Pass Ultimate Cloud" };
    case "xbox-marketplace":
      return { icon: IconBrandXbox, name: "Xbox Marketplace" };
    default:
      return { icon: IconHelpHexagon, name: null };
  }
};

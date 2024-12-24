import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { GameStoreModel, LikeLibrary } from "@contracts/database/games";
import { MantineSize } from "@mantine/core";
import { IconBrandSteam, IconBrandWindows, IconBrandXbox, IconHelpHexagon, IconProps } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { IconEpicGames } from "../../icons/IconEpicGames";
import { IconGog } from "../../icons/IconGog";

type LibraryIconProps = {
  game: GameStoreModel;
  size: MantineSize;
};

const configSelector = (library: LikeLibrary) => {
  switch (library) {
    case "epic-game-store":
      return { icon: IconEpicGames, library: "Epic Games" };
    case "gog":
      return { icon: IconGog, library: "GOG" };
    case "microsoft":
      return { icon: IconBrandWindows, library: "Microsoft" };
    case "steam":
      return { icon: IconBrandSteam, library: "Steam" };
    case "xbox-game-pass-ultimate-cloud":
      return { icon: IconBrandXbox, library: "Xbox Game Pass Ultimate Cloud" };
    case "xbox-marketplace":
      return { icon: IconBrandXbox, library: "Xbox Marketplace" };
    default:
      return { icon: IconHelpHexagon, library: null };
  }
};

export const LibraryIcon = ({ game, size, ...rest }: LibraryIconProps & IconProps) => {
  const { t } = useTranslation();

  const { icon, library } = configSelector(game.library);

  return (
    <TooltipIcon
      icon={icon}
      iconProps={rest}
      themeIconProps={{
        size,
      }}
      tooltipProps={{
        label: library ? t("thisIsALibraryGame", { library }) : t("libraryNotRecognised"),
      }}
    />
  );
};

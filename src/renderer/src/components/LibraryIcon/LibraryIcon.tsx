import { IconBrandSteam, IconHelpHexagon, IconProps } from "@tabler/icons-react";
import { MantineSize } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { GameStoreModel } from "@contracts/database/games";

type LibraryIconProps = {
  game: GameStoreModel;
  size: MantineSize;
};

const configSelector = (library: string) => {
  switch (library) {
    case "steam":
      return { icon: IconBrandSteam, library: "Steam" };
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

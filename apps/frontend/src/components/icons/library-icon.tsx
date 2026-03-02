import { IconProps } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { TooltipIcon } from "@components/icons/tooltip-icon";
import { GameStoreModel } from "@stakload/contracts/database/games";
import { mapLibraryIcon } from "@util/map-library-icon";

type LibraryIconProps = {
  game: GameStoreModel;
  size: "xs" | "sm" | "md" | "lg" | "xl";
};
export const LibraryIcon = ({ game, size, ...rest }: LibraryIconProps & IconProps) => {
  const { t } = useTranslation();

  const { icon, name } = mapLibraryIcon(game.library);

  return (
    <TooltipIcon
      icon={icon}
      iconProps={rest}
      themeIconProps={{
        size,
      }}
      tooltipProps={{
        label: name ? t("libraryIcon.libraryGame", { library: name }) : t("libraryIcon.unrecognized"),
      }}
    />
  );
};

import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { GameStoreModel } from "@contracts/database/games";
import { MantineSize } from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import { useTranslation } from "react-i18next";

type LibraryIconProps = {
  game: GameStoreModel;
  size: MantineSize;
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

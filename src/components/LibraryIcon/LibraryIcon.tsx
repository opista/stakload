import { IconBrandSteam, IconHelpHexagon, IconProps } from "@tabler/icons-react";
import { MantineSize, ThemeIcon, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { GameStoreModel } from "../../database";

type LibraryIconProps = {
  game: GameStoreModel;
  size: MantineSize;
};

export const LibraryIcon = ({ game, size, ...rest }: LibraryIconProps & IconProps) => {
  const { t } = useTranslation();

  const configSelector = (library: string) => {
    switch (library) {
      case "steam":
        return { Icon: IconBrandSteam, library: "Steam" };
      default:
        return { Icon: IconHelpHexagon, library: null };
    }
  };

  const { Icon, library } = configSelector(game.library);

  return (
    <Tooltip
      label={library ? t("thisIsALibraryGame", { library }) : t("libraryNotRecognised")}
      position="bottom-start"
    >
      <ThemeIcon size={size} variant="default">
        <Icon {...rest} style={{ width: "80%", height: "80%" }} stroke={1.5} />
      </ThemeIcon>
    </Tooltip>
  );
};

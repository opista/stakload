import { IconBrandSteam, IconHelpHexagon, IconProps } from "@tabler/icons-react";
import { GameStoreModel } from "../../database/schema/game.schema";
import { MantineSize, ThemeIcon, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";

type LibraryIconProps = {
  game: GameStoreModel;
  size: MantineSize;
};

export const LibraryIcon = ({ game, size, ...rest }: LibraryIconProps & IconProps) => {
  const { t } = useTranslation();

  const configSelector = (platform: string) => {
    switch (platform) {
      case "steam":
        return { Icon: IconBrandSteam, platform: t("platform.steam") };
      default:
        return { Icon: IconHelpHexagon, platform: t("platformNotRecognised") };
    }
  };

  const { Icon, platform } = configSelector(game.platform);

  return (
    <Tooltip label={t("thisIsALibraryGame", { platform })} position="bottom-start">
      <ThemeIcon size={size} variant="default">
        <Icon {...rest} style={{ width: "80%", height: "80%" }} stroke={1.5} />
      </ThemeIcon>
    </Tooltip>
  );
};

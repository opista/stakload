import { IconDeviceGamepad2, IconSearch } from "@tabler/icons-react";
import { Spotlight as MantineSpotlight, SpotlightActionData } from "@mantine/spotlight";
import { rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Image } from "@mantine/core";
import classes from "./Spotlight.module.css";
import { GameStoreModel } from "../../schema/games";

type SpotlightProps = {
  disabled?: boolean;
  games?: GameStoreModel[];
  onClick: (id: string) => void;
};

const DefaultIcon = <IconDeviceGamepad2 className={classes.defaultIcon} stroke={1.5} />;

const LeftSection = ({ icon }: { icon?: string }) => {
  if (!icon?.length) {
    return DefaultIcon;
  } else {
    return <Image className={classes.icon} src={icon} />;
  }
};

export const Spotlight = ({ disabled, games, onClick }: SpotlightProps) => {
  const { t } = useTranslation();

  const actions: SpotlightActionData[] =
    games?.map(({ _id, icon, lastPlayedAt, name }) => ({
      id: _id,
      label: name,
      description: lastPlayedAt
        ? t("gameDetails.lastPlayed", {
            date: lastPlayedAt,
            formatParams: {
              date: {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            },
          })
        : t("gameDetails.neverPlayed"),
      onClick: () => onClick(_id),
      leftSection: <LeftSection icon={icon} />,
    })) || [];

  return (
    <MantineSpotlight
      actions={actions}
      disabled={disabled}
      limit={7}
      nothingFound={t("spotlight.noResultsFound")}
      searchProps={{
        leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
        placeholder: t("search"),
      }}
    />
  );
};

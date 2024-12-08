import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { rem } from "@mantine/core";
import { Image } from "@mantine/core";
import { Spotlight as MantineSpotlight, SpotlightActionData } from "@mantine/spotlight";
import { IconDeviceGamepad2, IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import classes from "./Spotlight.module.css";

type SpotlightProps = {
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

export const Spotlight = ({ onClick }: SpotlightProps) => {
  const games = useGamesQuery<GameStoreModel[]>(window.api.getFilteredGames);
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
      limit={7}
      nothingFound={t("spotlight.noResultsFound")}
      searchProps={{
        leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
        placeholder: t("search"),
      }}
    />
  );
};

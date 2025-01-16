import { Image } from "@mantine/core";
import { Spotlight as MantineSpotlight, SpotlightActionData } from "@mantine/spotlight";
import { useGameStore } from "@store/game.store";
import { IconDeviceGamepad2, IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./Spotlight.module.css";

const DefaultIcon = <IconDeviceGamepad2 className={classes.icon} stroke={1.5} />;

const LeftSection = ({ icon }: { icon?: string }) => {
  if (!icon?.length) {
    return DefaultIcon;
  } else {
    return <Image className={classes.icon} src={icon} />;
  }
};

export const Spotlight = () => {
  const games = useGameStore(useShallow((state) => state.games));
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions: SpotlightActionData[] =
    games?.map(({ _id, icon, lastPlayedAt, name }) => ({
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
      id: _id,
      label: name,
      leftSection: <LeftSection icon={icon} />,
      onClick: () => navigate(`/desktop/games/${_id}`),
    })) || [];

  return (
    <MantineSpotlight
      actions={actions}
      limit={7}
      nothingFound={t("spotlight.noResultsFound")}
      searchProps={{
        leftSection: <IconSearch stroke={1.5} />,
        placeholder: t("search"),
      }}
    />
  );
};

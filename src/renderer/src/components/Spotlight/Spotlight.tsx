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
  onClick: (index: number) => void;
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
    games?.map(({ _id, icon, name }, index) => ({
      id: _id,
      label: name,
      description: t("gameDetails.lastPlayed", {
        /**
         * TODO
         * Pluck this from synced data. I think we'll
         * need to be smart about this later if we
         * want to track the user's playtime ourselves
         * post-sync. Maybe we don't do that and we just
         * fetch the latest game data?
         */
        date: new Date(),
        defaultValue: "Never",
        formatParams: {
          date: {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        },
      }),
      onClick: () => onClick(index),
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

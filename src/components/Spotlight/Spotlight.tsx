import { IconHome, IconSearch } from "@tabler/icons-react";
import { Spotlight as MantineSpotlight, SpotlightActionData } from "@mantine/spotlight";
import { rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { GameStoreModel } from "../../database";

type SpotlightProps = {
  games?: GameStoreModel[];
  onClick: (index: number) => void;
};

export const Spotlight = ({ games, onClick }: SpotlightProps) => {
  const { t } = useTranslation();

  const actions: SpotlightActionData[] =
    games?.map(({ id, name }, index) => ({
      id,
      label: name,
      description: t("gameDetails.lastPlayed", {
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
      leftSection: <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
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

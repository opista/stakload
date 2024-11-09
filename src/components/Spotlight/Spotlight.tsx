import { rem } from "@mantine/core";
import {
  Spotlight as MantineSpotlight,
  SpotlightActionData,
} from "@mantine/spotlight";
import { IconHome, IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useRxData } from "rxdb-hooks";
import { GameStoreModel } from "../../database/schema/game.schema";

export const Spotlight = () => {
  const { t } = useTranslation();
  const { result: games } = useRxData<GameStoreModel>("games", (collection) =>
    collection.find()
  );

  const actions: SpotlightActionData[] = games.map(({ _id, name }) => ({
    id: _id,
    label: name,
    description: t("lastPlayed", {
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
    }), // TODO
    onClick: () => console.log("Play game"), // TODO
    leftSection: (
      <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  }));

  return (
    <MantineSpotlight
      actions={actions}
      limit={7}
      nothingFound={t("noResultsFound")}
      searchProps={{
        leftSection: (
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        ),
        placeholder: t("search"),
      }}
    />
  );
};

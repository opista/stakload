import { rem } from "@mantine/core";
import {
  Spotlight as MantineSpotlight,
  SpotlightActionData,
} from "@mantine/spotlight";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const Spotlight = () => {
  const { t } = useTranslation();

  const actions: SpotlightActionData[] = [
    {
      id: "settings",
      label: t("settings"),
      description: t("updateYourSettings"),
      onClick: () => console.log("Settings was clicked"), // TODO
      leftSection: (
        <IconSettings
          style={{ width: rem(24), height: rem(24) }}
          stroke={1.5}
        />
      ),
    },
  ];

  return (
    <MantineSpotlight
      actions={actions}
      nothingFound={t("noResultsFound")}
      highlightQuery
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

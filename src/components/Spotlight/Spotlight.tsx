import { rem } from "@mantine/core";
import {
  Spotlight as MantineSpotlight,
  SpotlightActionData,
} from "@mantine/spotlight";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const Spotlight = () => {
  const { t } = useTranslation();

  const actions: SpotlightActionData[] = [];

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

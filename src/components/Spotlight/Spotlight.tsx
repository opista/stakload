import { rem, Button } from "@mantine/core";
import {
  Spotlight as MantineSpotlight,
  SpotlightActionData,
  spotlight,
} from "@mantine/spotlight";
import { IconSearch, IconSettings } from "@tabler/icons-react";

const actions: SpotlightActionData[] = [
  {
    id: "settings",
    label: "Settings",
    description: "Update your settings",
    onClick: () => console.log("Settings"),
    leftSection: (
      <IconSettings style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  },
];

export default function Spotlight() {
  return (
    <MantineSpotlight
      actions={actions}
      nothingFound="Nothing found..."
      highlightQuery
      searchProps={{
        leftSection: (
          <IconSearch
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        ),
        placeholder: "Search...",
      }}
    />
  );
}

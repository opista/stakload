import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { GameState } from "@contracts/store/game";
import { useGamesQuery } from "@hooks/use-games-query";
import { Button, Indicator, MultiSelect, Popover, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconAdjustmentsAlt, IconAdjustmentsSpark } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./GamesFilter.module.css";

type GamesFilterProps = {
  disabled?: boolean;
};

export const GamesFilter = ({ disabled }: GamesFilterProps) => {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();
  const { hasFilterSet, resetFilters, selectedFilterCount, selectedFilters, setSelectedFilter } = useGameStore(
    useShallow((state) => ({
      hasFilterSet: Object.values(state.selectedFilters).some((values) => values?.length),
      resetFilters: state.resetFilters,
      selectedFilterCount: Object.values(state.selectedFilters).filter((values) => values?.length).length,
      selectedFilters: state.selectedFilters,
      setSelectedFilter: state.setSelectedFilter,
    })),
  );

  const onClearFilters = () => resetFilters();

  const onFilterChange = (key: keyof GameState["selectedFilters"]) => (value: string[]) =>
    setSelectedFilter(key, value);

  const Icon = hasFilterSet ? IconAdjustmentsSpark : IconAdjustmentsAlt;

  const { data: filters } = useGamesQuery(window.api.getGameFilters);

  return (
    <Popover
      closeOnEscape
      disabled={disabled}
      onChange={setOpened}
      opened={opened}
      position="right-start"
      shadow="sm"
      width={500}
      withArrow
    >
      <Popover.Target>
        <Indicator
          disabled={!selectedFilterCount}
          label={selectedFilterCount}
          offset={3}
          position="bottom-end"
          size={16}
          withBorder
        >
          <ActionIcon
            aria-label={t("filters")}
            className={classes.icon}
            disabled={disabled}
            icon={Icon}
            onClick={() => setOpened((o) => !o)}
            size="lg"
          />
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">TODO - Filters here</Text>
        <MultiSelect
          label="Developers"
          comboboxProps={{ withinPortal: false }}
          clearable
          data={filters?.["developers"]}
          onChange={onFilterChange("developers")}
          searchable
          value={selectedFilters.developers}
        />
        <MultiSelect
          label="Game modes"
          comboboxProps={{ withinPortal: false }}
          clearable
          data={filters?.["gameModes"]}
          onChange={onFilterChange("gameModes")}
          searchable
          value={selectedFilters.gameModes}
        />
        <MultiSelect
          label="Genres"
          comboboxProps={{ withinPortal: false }}
          clearable
          data={filters?.["genres"]}
          onChange={onFilterChange("genres")}
          searchable
          value={selectedFilters.genres}
        />
        <MultiSelect
          label="Player perspectives"
          comboboxProps={{ withinPortal: false }}
          clearable
          data={filters?.["playerPerspectives"]}
          onChange={onFilterChange("playerPerspectives")}
          searchable
          value={selectedFilters.playerPerspectives}
        />
        <MultiSelect
          label="Publishers"
          comboboxProps={{ withinPortal: false }}
          clearable
          data={filters?.["publishers"]}
          onChange={onFilterChange("publishers")}
          searchable
          value={selectedFilters.publishers}
        />
        <Button color="red" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

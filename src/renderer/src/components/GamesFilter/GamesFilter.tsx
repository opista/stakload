import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { LikeAgeRatingText } from "@contracts/database/games";
import { GameState } from "@contracts/store/game";
import { useGamesQuery } from "@hooks/use-games-query";
import { Button, Grid, Group, Indicator, MultiSelect, Popover, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconAdjustmentsAlt, IconAdjustmentsSpark, IconPlaylistAdd } from "@tabler/icons-react";
import { ParseKeys } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./GamesFilter.module.css";

type GamesFilterProps = {
  disabled?: boolean;
};

const ageRatingFilters: { label: ParseKeys; value: LikeAgeRatingText }[] = [
  {
    label: "ageRating.THREE",
    value: "THREE",
  },
  {
    label: "ageRating.SEVEN",
    value: "SEVEN",
  },
  {
    label: "ageRating.TWELVE",
    value: "TWELVE",
  },
  {
    label: "ageRating.SIXTEEN",
    value: "SIXTEEN",
  },
  {
    label: "ageRating.EIGHTEEN",
    value: "EIGHTEEN",
  },
];

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

  const onSaveFilters = () => {};

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
        <Grid>
          <Grid.Col span={6}>
            <MultiSelect
              label="Developers"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={filters?.["developers"]}
              onChange={onFilterChange("developers")}
              searchable
              value={selectedFilters.developers}
            />
            <MultiSelect
              label="Publishers"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={filters?.["publishers"]}
              onChange={onFilterChange("publishers")}
              searchable
              value={selectedFilters.publishers}
            />
            <MultiSelect
              label="Player perspectives"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={filters?.["playerPerspectives"]}
              onChange={onFilterChange("playerPerspectives")}
              searchable
              value={selectedFilters.playerPerspectives}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              label="Age ratings"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={ageRatingFilters.map(({ label, value }) => ({ label: t(label), value }))}
              onChange={onFilterChange("ageRatings")}
              searchable
              value={selectedFilters.ageRatings}
            />
            <MultiSelect
              label="Game modes"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={filters?.["gameModes"]}
              onChange={onFilterChange("gameModes")}
              searchable
              value={selectedFilters.gameModes}
            />
            <MultiSelect
              label="Genres"
              mb="xs"
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              clearable
              data={filters?.["genres"]}
              onChange={onFilterChange("genres")}
              searchable
              value={selectedFilters.genres}
            />
          </Grid.Col>
        </Grid>
        <Group classNames={{ root: classes.buttonContainer }} justify="flex-end">
          <Button color="red" onClick={onClearFilters}>
            Clear filters
          </Button>
          <Button disabled={!hasFilterSet} leftSection={<IconPlaylistAdd />} onClick={onSaveFilters}>
            Create collection
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

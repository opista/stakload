import { GameFilters, Library, LikeAgeRatingText } from "@contracts/database/games";
import { Checkbox, Flex, Grid, MultiSelect, Pill, Popover, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconAdjustmentsAlt } from "@tabler/icons-react";
import clsx from "clsx";
import { ParseKeys } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./GamesFilter.module.css";

type GamesFilterProps = {
  disabled?: boolean;
  filters: GameFilters;
  onChange: (filters: GameFilters) => void;
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

const libraryFilters: { label: string; value: Library }[] = [
  {
    label: "Epic Game Store",
    value: "epic-game-store",
  },
  {
    label: "GOG",
    value: "gog",
  },
  {
    label: "Steam",
    value: "steam",
  },
];

export const GamesFilter = ({ disabled, filters, onChange }: GamesFilterProps) => {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  const { gameFilters } = useGameStore(useShallow((state) => ({ gameFilters: state.gameFilters })));

  const onFilterChange = (key: keyof GameFilters) => (value: string[] | boolean | null) =>
    onChange({
      ...filters,
      [key]: value,
    });

  return (
    <Popover
      arrowOffset={10}
      arrowPosition="center"
      closeOnEscape
      disabled={disabled}
      offset={16}
      onChange={setOpened}
      opened={opened}
      position="bottom-start"
      shadow="sm"
      width={500}
      withArrow
    >
      <Popover.Target>
        <Pill
          className={clsx(classes.pill, { [classes.active]: opened })}
          onClick={() => setOpened((o) => !o)}
          size="md"
        >
          <Flex align="center" className={classes.pillInner} gap={4}>
            <IconAdjustmentsAlt size={16} stroke={1} />
            <span>All Filters</span>
          </Flex>
        </Pill>
      </Popover.Target>
      <Popover.Dropdown>
        <Title className={classes.title} size="h3">
          {t("filters.title")}
        </Title>
        <Grid>
          <Grid.Col span={12}>
            <Checkbox
              checked={filters.isInstalled || false}
              label={t("filters.isInstalled")}
              onChange={(event) => onFilterChange("isInstalled")(event.target.checked ? true : null)}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={libraryFilters}
              label={t("filters.libraries")}
              onChange={onFilterChange("libraries")}
              searchable
              value={filters.libraries}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.["developers"]}
              label={t("filters.developers")}
              onChange={onFilterChange("developers")}
              searchable
              value={filters.developers}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.["publishers"]}
              label={t("filters.publishers")}
              onChange={onFilterChange("publishers")}
              searchable
              value={filters.publishers}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.["playerPerspectives"]}
              label={t("filters.playerPerspectives")}
              onChange={onFilterChange("playerPerspectives")}
              searchable
              value={filters.playerPerspectives}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.platforms}
              label={t("filters.platforms")}
              onChange={onFilterChange("platforms")}
              searchable
              value={filters.platforms}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={ageRatingFilters.map(({ label, value }) => ({ label: t(label), value }))}
              label={t("filters.ageRatings")}
              onChange={onFilterChange("ageRatings")}
              searchable
              value={filters.ageRatings}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.["gameModes"]}
              label={t("filters.gameModes")}
              onChange={onFilterChange("gameModes")}
              searchable
              value={filters.gameModes}
            />
            <MultiSelect
              className={classes.select}
              clearable
              comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
              data={gameFilters?.["genres"]}
              label={t("filters.genres")}
              onChange={onFilterChange("genres")}
              searchable
              value={filters.genres}
            />
          </Grid.Col>
        </Grid>
      </Popover.Dropdown>
    </Popover>
  );
};

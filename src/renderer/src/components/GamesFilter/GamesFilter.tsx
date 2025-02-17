import { CollectionCreateModal } from "@components/CollectionCreateModal/CollectionCreateModal";
import { GameFilters, Library, LikeAgeRatingText } from "@contracts/database/games";
import { ActionIcon, Button, Checkbox, Grid, Group, Indicator, MultiSelect, Popover, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGameStore } from "@store/game.store";
import { IconAdjustmentsHorizontal, IconPlaylistAdd } from "@tabler/icons-react";
import { ParseKeys } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import classes from "./GamesFilter.module.css";

const DEFAULT_FILTERS: Record<keyof GameFilters, undefined> = {
  ageRatings: undefined,
  createdAt: undefined,
  developers: undefined,
  gameModes: undefined,
  genres: undefined,
  isFavourite: undefined,
  isInstalled: undefined,
  isQuickLaunch: undefined,
  libraries: undefined,
  platforms: undefined,
  playerPerspectives: undefined,
  publishers: undefined,
};

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
  const [openedCreate, { close: closeCreate, open: openCreate }] = useDisclosure(false);
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

  const { gameFilters } = useGameStore(useShallow((state) => ({ gameFilters: state.gameFilters })));

  const hasFilterSet = filters ? Object.values(filters).some((values) => values?.length) : false;
  const resetFilters = () => onChange(DEFAULT_FILTERS);
  const selectedFilterCount = filters ? Object.values(filters).filter((values) => values?.length).length : 0;

  const onClearFilters = () => resetFilters();

  const onFilterChange = (key: keyof GameFilters) => (value: string[] | boolean | null) =>
    onChange({
      ...filters,
      [key]: value,
    });

  const onSaveFilters = () => {
    setOpened(false);
    openCreate();
  };

  const onCreate = async (name: string, icon?: string) => {
    if (!filters) return;
    await window.api.createCollection({ filters, icon, name });
    closeCreate();
  };

  /**
   *
   * TODO
   * - trigger event when collections are updated
   * - update filters to track whether filters are "dirty".
   *   If the filters haven't changed you shouldn't be able
   *   to create a new collection. But if you they have you should
   *   be able to create OR update an existing one
   * - How do you delete? Should we enable collectiom management
   *   somewhere?
   *
   */

  return (
    <>
      <Popover
        closeOnEscape
        disabled={disabled}
        offset={16}
        onChange={setOpened}
        opened={opened}
        position="bottom"
        shadow="sm"
        width={500}
      >
        <Popover.Target>
          <Indicator
            disabled={!selectedFilterCount}
            label={selectedFilterCount}
            offset={5}
            position="bottom-end"
            size={18}
            withBorder
          >
            <ActionIcon
              aria-label={t("filters.title")}
              className={classes.filtersButton}
              disabled={disabled}
              onClick={() => setOpened((o) => !o)}
            >
              <IconAdjustmentsHorizontal size={20} stroke={1} />
            </ActionIcon>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown>
          <Title className={classes.title} size="h3">
            {t("filters.title")}
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <Checkbox
                checked={filters.isInstalled || false}
                label={t("filters.isInstalled")}
                onChange={(event) => onFilterChange("isInstalled")(event.target.checked ? true : null)}
              />
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
          <Group classNames={{ root: classes.buttonContainer }} justify="flex-end">
            <Button color="red" onClick={onClearFilters}>
              {t("filters.clearFilters")}
            </Button>
            <Button disabled={!hasFilterSet} leftSection={<IconPlaylistAdd />} onClick={onSaveFilters}>
              {t("filters.createCollection")}
            </Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
      <CollectionCreateModal onClose={() => closeCreate()} onConfirm={onCreate} opened={openedCreate} />
    </>
  );
};

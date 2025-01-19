import { CollectionCreateModal } from "@components/CollectionCreateModal/CollectionCreateModal";
import { LikeAgeRatingText, LikeLibrary } from "@contracts/database/games";
import { GameState } from "@contracts/store/game";
import { useGamesQuery } from "@hooks/use-games-query";
import { ActionIcon, Button, Grid, Group, Indicator, MultiSelect, Popover, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useGameStore } from "@store/game.store";
import { IconAdjustmentsHorizontal, IconPlaylistAdd } from "@tabler/icons-react";
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

const libraryFilters: { label: string; value: LikeLibrary }[] = [
  {
    label: "Epic Game Store",
    value: "epic-game-store",
  },
  {
    label: "GOG",
    value: "gog",
  },
  {
    label: "Microsoft",
    value: "microsoft",
  },
  {
    label: "Steam",
    value: "steam",
  },
  {
    label: "Xbox Game Pass Ultimate Cloud",
    value: "xbox-game-pass-ultimate-cloud",
  },
  {
    label: "Xbox Marketplace",
    value: "xbox-marketplace",
  },
];

export const GamesFilter = ({ disabled }: GamesFilterProps) => {
  const [openedCreate, { close: closeCreate, open: openCreate }] = useDisclosure(false);
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();
  const { hasFilterSet, resetFilters, selectedFilterCount, selectedFilters, setSelectedCollection, setSelectedFilter } =
    useGameStore(
      useShallow((state) => ({
        hasFilterSet: Object.values(state.selectedFilters).some((values) => values?.length),
        resetFilters: state.resetFilters,
        setSelectedCollection: state.setSelectedCollection,
        selectedFilterCount: Object.values(state.selectedFilters).filter((values) => values?.length).length,
        selectedFilters: state.selectedFilters,
        setSelectedFilter: state.setSelectedFilter,
        setMultipleFilters: state.setMultipleFilters,
      })),
    );

  const onClearFilters = () => resetFilters();

  const onFilterChange = (key: keyof GameState["selectedFilters"]) => (value: string[]) =>
    setSelectedFilter(key, value);

  const { data: filters } = useGamesQuery(window.api.getGameFilters);

  const onSaveFilters = () => {
    setOpened(false);
    openCreate();
  };

  const onCreate = async (name: string, icon?: string) => {
    const collection = await window.api.createCollection({ name, filters: selectedFilters, icon });
    setSelectedCollection(collection._id);
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
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={libraryFilters}
                label={t("filters.libraries")}
                onChange={onFilterChange("libraries")}
                searchable
                value={selectedFilters.libraries}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.["developers"]}
                label={t("filters.developers")}
                onChange={onFilterChange("developers")}
                searchable
                value={selectedFilters.developers}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.["publishers"]}
                label={t("filters.publishers")}
                onChange={onFilterChange("publishers")}
                searchable
                value={selectedFilters.publishers}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.["playerPerspectives"]}
                label={t("filters.playerPerspectives")}
                onChange={onFilterChange("playerPerspectives")}
                searchable
                value={selectedFilters.playerPerspectives}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.platforms}
                label={t("filters.platforms")}
                onChange={onFilterChange("platforms")}
                searchable
                value={selectedFilters.platforms}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={ageRatingFilters.map(({ label, value }) => ({ label: t(label), value }))}
                label={t("filters.ageRatings")}
                onChange={onFilterChange("ageRatings")}
                searchable
                value={selectedFilters.ageRatings}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.["gameModes"]}
                label={t("filters.gameModes")}
                onChange={onFilterChange("gameModes")}
                searchable
                value={selectedFilters.gameModes}
              />
              <MultiSelect
                className={classes.select}
                clearable
                comboboxProps={{ position: "bottom-start", width: "auto", withinPortal: false }}
                data={filters?.["genres"]}
                label={t("filters.genres")}
                onChange={onFilterChange("genres")}
                searchable
                value={selectedFilters.genres}
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

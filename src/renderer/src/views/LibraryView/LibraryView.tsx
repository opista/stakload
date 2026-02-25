import { CollectionCreateModal } from "@components/CollectionCreateModal/CollectionCreateModal";
import { FilterControl } from "@components/Desktop/FilterControl/FilterControl";
import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GhostIcon } from "@components/GhostIcon/GhostIcon";
import { PageTitle } from "@components/PageTitle/PageTitle";
import { useGamesQuery } from "@hooks/use-games-query";
import { Button, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { GameFilters } from "../../ipc.types";

import classes from "./LibraryView.module.css";

const EmptyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onImportClick = () => navigate("/settings/integrations");

  return (
    <Stack align="center" className={classes.notFoundContainer} justify="center">
      <GhostIcon />
      <Text c="dimmed">{t("library.noGamesFound")}</Text>
      <Button leftSection={<IconSquareRoundedPlus />} onClick={onImportClick}>
        {t("library.importGames")}
      </Button>
    </Stack>
  );
};

export const LibraryView = () => {
  const { t } = useTranslation();
  const createCollection = useCollectionStore(useShallow((state) => state.createCollection));
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const [openedCreate, { close: closeCreate, open: openCreate }] = useDisclosure(false);
  const [filters, setFilters] = useState<GameFilters>({});
  const { data: games } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  const cleanFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );

  const hasFiltersSet = !!Object.keys(cleanFilters).length;

  const onCreate = async (name: string, icon?: string) => {
    if (!filters) return;
    await createCollection({ filters, icon, name });
    closeCreate();
  };

  return (
    <>
      <Stack h="100%" w="100%">
        <SectionHeading className="flex-col gap-4">
          <PageTitle>{t("library.title")}</PageTitle>
          <FilterControl onChange={setFilters} onCreate={openCreate} />
        </SectionHeading>
        {!games?.length && !hasFiltersSet ? <EmptyView /> : <GamesGrid games={games} />}
      </Stack>
      <CollectionCreateModal onClose={() => closeCreate()} onConfirm={onCreate} opened={openedCreate} />
    </>
  );
};

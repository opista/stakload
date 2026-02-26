import { GamesGrid } from "@components/game/games-grid";
import { GhostIcon } from "@components/icons/ghost-icon";
import { FilterControl } from "@components/layout/desktop/filter-control";
import { SectionHeading } from "@components/layout/desktop/section-heading";
import { PageTitle } from "@components/layout/page-title";
import { CollectionCreateModal } from "@components/misc/collection-create-modal";
import { Button } from "@components/ui/button";
import { useGamesQuery } from "@hooks/use-games-query";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { GameFilters } from "../../ipc.types";

const EmptyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onImportClick = () => navigate("/settings/integrations");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <GhostIcon />
      <span className="text-neutral-500 font-medium">{t("library.noGamesFound")}</span>
      <Button leftIcon={<IconSquareRoundedPlus size={18} />} onClick={onImportClick} size="sm">
        {t("library.importGames")}
      </Button>
    </div>
  );
};

export const LibraryView = () => {
  const { t } = useTranslation();
  const createCollection = useCollectionStore(useShallow((state) => state.createCollection));
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const [openedCreate, setOpenedCreate] = useState(false);
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
    setOpenedCreate(false);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col gap-4">
        <SectionHeading className="flex-col !items-start gap-4">
          <PageTitle>{t("library.title")}</PageTitle>
          <FilterControl onChange={setFilters} onCreate={() => setOpenedCreate(true)} />
        </SectionHeading>
        {!games?.length && !hasFiltersSet ? <EmptyView /> : <GamesGrid games={games} />}
      </div>
      <CollectionCreateModal onClose={() => setOpenedCreate(false)} onConfirm={onCreate} opened={openedCreate} />
    </>
  );
};


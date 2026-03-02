import { GamesGrid } from "@components/game/games-grid";
import { GhostIcon } from "@components/icons/ghost-icon";
import { SectionHeading } from "@components/layout/desktop/section-heading";
import { PageTitle } from "@components/layout/page-title";
import { Button } from "@components/ui/button";
import { useGamesQuery } from "@hooks/use-games-query";
import { useGameStore } from "@store/game.store";
import { IconCategory } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

const EmptyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onLibraryClick = () => navigate("/library");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <GhostIcon />
      <div className="text-center">
        <p className="font-medium text-neutral-500">{t("favourites.notFoundTitle")}</p>
        <p className="text-sm text-neutral-500">{t("favourites.notFoundDescription")}</p>
      </div>
      <Button leftIcon={IconCategory} onClick={onLibraryClick} size="sm">
        {t("favourites.libraryButton")}
      </Button>
    </div>
  );
};

export const FavouritesView = () => {
  const { t } = useTranslation();
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const { data: games } = useGamesQuery(() => fetchFilteredGames({ isFavourite: true }));

  return (
    <div className="flex h-full w-full flex-col gap-4 px-12 pt-12">
      <SectionHeading className="flex-col items-start gap-4 pl-2">
        <PageTitle>{t("favourites.title")}</PageTitle>
      </SectionHeading>
      {games?.length ? <GamesGrid games={games} /> : <EmptyView />}
    </div>
  );
};

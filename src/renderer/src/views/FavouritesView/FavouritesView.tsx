import { Button } from "@components/Button/Button";
import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GhostIcon } from "@components/GhostIcon/GhostIcon";
import { PageTitle } from "@components/PageTitle/PageTitle";
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
        <p className="text-neutral-500 font-medium">{t("favourites.notFoundTitle")}</p>
        <p className="text-neutral-500 text-sm">{t("favourites.notFoundDescription")}</p>
      </div>
      <Button leftIcon={<IconCategory size={18} />} onClick={onLibraryClick} size="sm">
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
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
      <SectionHeading>
        <PageTitle>{t("favourites.title")}</PageTitle>
      </SectionHeading>
      {games?.length ? <GamesGrid games={games} /> : <EmptyView />}
    </div>
  );
};

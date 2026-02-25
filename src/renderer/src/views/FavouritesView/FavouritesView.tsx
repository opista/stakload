import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GhostIcon } from "@components/GhostIcon/GhostIcon";
import { useGamesQuery } from "@hooks/use-games-query";
import { Button, Stack, Text, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconCategory, IconStar } from "@tabler/icons-react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./FavouritesView.module.css";

const EmptyView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onLibraryClick = () => navigate("/library");

  return (
    <Stack align="center" className={classes.notFoundContainer} justify="center">
      <GhostIcon />
      <div>
        <Text c="dimmed">{t("favourites.notFoundTitle")}</Text>
        <Text c="dimmed">{t("favourites.notFoundDescription")}</Text>
      </div>
      <Button leftSection={<IconCategory />} onClick={onLibraryClick}>
        {t("favourites.libraryButton")}
      </Button>
    </Stack>
  );
};

export const FavouritesView = () => {
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const { data: games } = useGamesQuery(() => fetchFilteredGames({ isFavourite: true }));

  return (
    <div className={classes.container}>
      <SectionHeading className="gap-4">
        <IconStar size={40} />
        <Title order={1}>{t("favourites.title")}</Title>
      </SectionHeading>
      {games?.length ? <GamesGrid games={games} /> : <EmptyView />}
    </div>
  );
};

import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameListModel, IdAndName } from "@contracts/database/games";
import { Flex, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

const filterGamesByCollectionRules = (
  games: GameListModel[],
  filters: Record<string, string[]> | undefined,
): GameListModel[] => {
  if (!filters) return games;

  return games.filter((game) =>
    Object.entries(filters)
      .filter(([_key, filterValues]) => filterValues.length)
      .every(([key, filterValues]) => {
        const gameValue = game[key as keyof GameListModel];

        if (Array.isArray(gameValue) && gameValue.length > 0 && "id" in gameValue[0]) {
          const gameIds = (gameValue as IdAndName[]).map((item) => item.id);
          return filterValues.some((value) => gameIds.includes(value));
        }
        if (typeof gameValue === "string") {
          return filterValues.includes(gameValue);
        }

        return false;
      }),
  );
};

export const CollectionView = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { collection, gamesList } = useGameStore(
    useShallow((state) => ({
      collection: state.collections.find((c) => c._id === id),
      gamesList: state.gamesList,
    })),
  );

  const filteredGames = useMemo(
    () => filterGamesByCollectionRules(gamesList, collection?.filters),
    [gamesList, collection?.filters],
  );

  if (!collection) {
    return <Title order={3}>{t("collection.notFound")}</Title>;
  }

  return (
    <div className={classes.container}>
      <Flex className={classes.header}>
        <Title order={1}>{collection.name}</Title>
      </Flex>
      <GamesGrid games={filteredGames} />
    </div>
  );
};

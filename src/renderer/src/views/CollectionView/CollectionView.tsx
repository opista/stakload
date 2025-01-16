import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameStoreModel, IdAndName } from "@contracts/database/games";
import { Flex, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

const filterGamesByCollectionRules = <T extends GameStoreModel>(
  games: T[],
  filters: Partial<Record<keyof T, string[]>> | undefined,
): T[] => {
  if (!filters) return games;

  return games.filter((game) =>
    Object.entries(filters)
      .filter(([_key, filterValues]) => filterValues.length)
      .every(([key, filterValues]) => {
        const gameValue = game[key as keyof T];
        // Handle IdAndName[] fields
        if (Array.isArray(gameValue) && gameValue.length > 0 && "id" in gameValue[0]) {
          const gameIds = (gameValue as IdAndName[]).map((item) => item.id);
          return filterValues.some((value) => gameIds.includes(value));
        }

        // Handle string fields
        if (typeof gameValue === "string") {
          return filterValues.includes(gameValue);
        }

        return false;
      }),
  );
};

export const CollectionView = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { collection, games } = useGameStore(
    useShallow((state) => ({
      collection: state.collections.find(({ _id }) => _id === id),
      games: state.games,
    })),
  );

  const filteredGames = useMemo(
    () => filterGamesByCollectionRules(games, collection?.filters),
    [games, collection?.filters],
  );

  if (!collection) {
    return <Title order={3}>{t("collectionNotFound")}</Title>;
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

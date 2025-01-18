import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameListModel } from "@contracts/database/games";
import { Flex, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./CollectionView.module.css";

export const CollectionView = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [games, setGames] = useState<GameListModel[]>([]);

  const collection = useGameStore(useShallow((state) => state.collections.find((c) => c._id === id)));

  useEffect(() => {
    if (collection?.filters) {
      window.api.getCollectionGames(collection._id).then(setGames).catch(console.error);
    }
  }, [collection?.filters]);

  if (!collection) {
    return <Title order={3}>{t("collection.notFound")}</Title>;
  }

  return (
    <div className={classes.container}>
      <Flex className={classes.header}>
        <Title order={1}>{collection.name}</Title>
      </Flex>
      <GamesGrid games={games} />
    </div>
  );
};

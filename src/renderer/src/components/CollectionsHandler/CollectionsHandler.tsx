import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const CollectionsHandler = () => {
  const fetchCollections = useGameStore(useShallow((state) => state.fetchCollections));

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onCollectionsUpdated(() => fetchCollections());
    return () => removeListener();
  }, []);

  return <></>;
};

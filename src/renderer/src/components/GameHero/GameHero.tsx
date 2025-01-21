import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage } from "@mantine/core";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import classes from "./GameHero.module.css";

type GameHeroProps = {
  className?: string;
  game: GameStoreModel;
};

export const GameHero = ({ className, game }: GameHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const headerImage = useMemo(() => {
    const media = getHighestRatioMedia(game?.artworks);
    return media?.url || game?.screenshots?.[0] || "";
  }, [game]);

  useEffect(() => {
    setIsLoaded(false);

    if (headerImage) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
      };
      img.src = headerImage;
    }
  }, [headerImage]);

  return (
    <BackgroundImage className={clsx(classes.hero, className, { [classes.visible]: isLoaded })} src={headerImage} />
  );
};

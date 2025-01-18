import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage } from "@mantine/core";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import clsx from "clsx";

import classes from "./GameHero.module.css";

type GameHeroProps = {
  className?: string;
  game: GameStoreModel;
};

export const GameHero = ({ className, game }: GameHeroProps) => {
  const media = getHighestRatioMedia(game?.artworks);
  const headerImage = media?.url || game?.screenshots?.[0];

  return <BackgroundImage className={clsx(classes.hero, className)} src={headerImage || ""} />;
};

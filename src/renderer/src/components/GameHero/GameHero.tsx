import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage } from "@mantine/core";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import { rgbToHsl } from "@util/rgb-to-hsl";
import Vibrant from "node-vibrant";
import { useEffect } from "react";

import classes from "./GameHero.module.css";

type GameHeroProps = {
  game: GameStoreModel;
};

export const GameHero = ({ game }: GameHeroProps) => {
  const media = getHighestRatioMedia(game?.artworks);
  const headerImage = media?.url || game?.screenshots?.[0];

  useEffect(() => {
    if (!headerImage) return;

    const v = new Vibrant(headerImage);
    v.getPalette()
      .then((r) => {
        const rgb = r.DarkMuted?.getRgb();
        if (!rgb) return;
        const color = rgbToHsl(...rgb);
        const formatted = `hsl(${color})`;
        document.body.style.setProperty("--gradient-color", formatted);
      })
      .catch(() => {});

    return () => {
      document.body.style.setProperty("--gradient-color", "transparent");
    };
  }, [headerImage]);

  return <BackgroundImage className={classes.hero} src={headerImage || ""} />;
};

import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage } from "@mantine/core";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import { rgbToHsl } from "@util/rgb-to-hsl";
import clsx from "clsx";
import Vibrant from "node-vibrant";
import { useEffect } from "react";

import classes from "./GameHero.module.css";

type GameHeroProps = {
  className?: string;
  game: GameStoreModel;
  onPaletteChange?: (hsl: string | null) => void;
};

export const GameHero = ({ className, game, onPaletteChange }: GameHeroProps) => {
  const media = getHighestRatioMedia(game?.artworks);
  const headerImage = media?.url || game?.screenshots?.[0];

  useEffect(() => {
    if (!headerImage) {
      onPaletteChange?.(null);
      return;
    }

    const v = new Vibrant(headerImage);
    v.getPalette()
      .then((r) => {
        const rgb = r.DarkMuted?.getRgb();
        if (!rgb) {
          throw new Error("No colour found");
        }
        const color = rgbToHsl(...rgb);
        const formatted = `hsl(${color})`;

        /**
         * TODO - store color on game so that
         * we can skip this process second time
         * around?
         */
        onPaletteChange?.(formatted);
      })
      .catch(() => {
        onPaletteChange?.(null);
      });
  }, [headerImage]);

  return <BackgroundImage className={clsx(classes.hero, className)} src={headerImage || ""} />;
};

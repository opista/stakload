import { GameStoreModel } from "@stakload/contracts/database/games";
import { cn } from "@util/cn";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import { useEffect, useMemo, useState } from "react";

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
    <div
      className={cn(
        "bg-cover bg-center transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        backgroundImage: `url(${headerImage})`,
        maskComposite: "intersect",
        maskImage: `
          linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 25%, black 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.2) 90%, transparent 100%),
          linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.5) 30%, black 50%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, transparent 100%)
        `,
        WebkitMaskComposite: "source-in", // For Safari/Chrome
        WebkitMaskImage: `
          linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 25%, black 50%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.2) 90%, transparent 100%),
          linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.5) 30%, black 50%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 80%, transparent 100%)
        `,
      }}
    />
  );
};

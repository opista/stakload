import { FeaturedGameModel } from "@contracts/database/games";
import { useHover, useInterval, useInViewport } from "@mantine/hooks";
import { cn } from "@util/cn";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

type FeaturedGameProps = {
  game: FeaturedGameModel;
};

export const FeaturedGame = ({ game }: FeaturedGameProps) => {
  const { t } = useTranslation();
  const hasScreenshots = !!game.screenshots?.length;
  const screenshots = hasScreenshots ? game.screenshots!.slice(0, 3) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { hovered, ref: hoverRef } = useHover();
  const { inViewport, ref: inViewportRef } = useInViewport();

  const interval = useInterval(() => {
    setCurrentIndex((current) => (current + 1) % screenshots.length);
  }, 10000);

  useEffect(() => {
    if (!hasScreenshots || hovered || !inViewport) {
      interval.stop();
    } else {
      interval.start();
    }
    return interval.stop;
  }, [hovered, inViewport, hasScreenshots]);

  const handleImageClick = (index: number) => {
    if (!hasScreenshots) return;
    setCurrentIndex(index);
    interval.stop();
    interval.start();
  };

  return (
    <div className="flex h-full w-full gap-4 overflow-hidden rounded-2xl bg-[var(--color)] p-4 shadow-lg">
      <div className="grid w-full grow grid-cols-11 gap-3">
        <div className="col-span-5">
          <div className="aspect-[3/2] w-full overflow-hidden rounded-xl">
            <div className="relative h-full w-full" ref={hoverRef as any}>
              {hasScreenshots ? (
                screenshots.map((screenshot, index) => (
                  <div
                    className={cn(
                      "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
                      index === currentIndex ? "opacity-100" : "opacity-0",
                    )}
                    key={screenshot}
                    style={{ backgroundImage: `url(${screenshot})` }}
                  />
                ))
              ) : (
                <div className="h-full w-full bg-[#1b2c3b]" />
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1" ref={inViewportRef as any}>
          <div className="flex h-full flex-col justify-between gap-2">
            {hasScreenshots
              ? screenshots.map((screenshot, index) => (
                <button
                  className="h-full w-full cursor-pointer rounded-lg bg-cover bg-center transition-opacity hover:opacity-80 focus:outline-none"
                  key={screenshot}
                  onClick={() => handleImageClick(index)}
                  style={{ backgroundImage: `url(${screenshot})` }}
                  type="button"
                />
              ))
              : Array(3)
                .fill(null)
                .map((_, index) => <div className="h-full w-full rounded-lg bg-[#1b2c3b]" key={index} />)}
          </div>
        </div>
        <div className="col-span-5">
          <div className="flex h-full flex-col gap-2 p-2 px-0">
            <h2 className="line-clamp-1 text-2xl font-bold leading-tight">{game.name}</h2>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {game.genres?.map((genre) => (
                <span
                  className="shrink-0 rounded-md bg-cyan-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400"
                  key={genre.id}
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <p className="mt-1 line-clamp-3 text-sm text-neutral-300">{game.summary}</p>
            <NavLink
              className="mt-auto block w-fit text-sm font-bold text-cyan-400 transition-colors hover:text-cyan-300"
              to={`/library/${game._id}`}
            >
              {t("featuredGame.viewDetails")}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

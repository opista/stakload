import { FeaturedGameModel } from "@contracts/database/games";
import { cn } from "@util/cn";
import { useEffect, useRef, useState } from "react";
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
  const [hovered, setHovered] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const inViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), { threshold: 0.1 });
    if (inViewportRef.current) observer.observe(inViewportRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasScreenshots || hovered || !inViewport) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % screenshots.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [hovered, inViewport, hasScreenshots, screenshots.length]);

  const handleImageClick = (index: number) => {
    if (!hasScreenshots) return;
    setCurrentIndex(index);
  };

  return (
    <div
      className="flex h-full w-full gap-4 overflow-hidden rounded-2xl bg-[var(--color)] p-4 shadow-lg"
      ref={inViewportRef}
    >
      <div className="grid w-full grow grid-cols-11 gap-3">
        <div className="col-span-5">
          <div className="aspect-[3/2] w-full overflow-hidden rounded-xl">
            <div
              className="relative h-full w-full"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
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
        <div className="col-span-1">
          <div className="flex h-full flex-col justify-between gap-2">
            {hasScreenshots
              ? screenshots.map((screenshot, index) => (
                  <button
                    className={cn(
                      "h-full w-full cursor-pointer rounded-lg bg-cover bg-center transition-all hover:opacity-80 focus:outline-none ring-primary/50",
                      index === currentIndex ? "ring-2 opacity-100" : "opacity-40",
                    )}
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

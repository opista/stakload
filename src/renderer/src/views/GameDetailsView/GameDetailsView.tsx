import { ContentCard } from "@components/game/ContentCard";
import { GameDetailsTable } from "@components/game/GameDetailsTable/GameDetailsTable";
import { GameHero } from "@components/game/GameHero";
import { GameLinks } from "@components/game/GameLinks";
import { IncompatibilityIcon } from "@components/icons/IncompatibilityIcon";
import { LibraryIcon } from "@components/icons/LibraryIcon";
import { ProtonIcon } from "@components/icons/ProtonIcon";
import { GameHeader } from "@components/layout/Desktop/GameHeader";
import { MediaCarousel } from "@components/media/MediaCarousel";
import { Spoiler } from "@components/ui/Spoiler";
import { GameStoreModel } from "@contracts/database/games";
import { useGameStore } from "@store/game.store";
import { RefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const GameDetailsView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();

  const { fetchGameDetails, gameDetails } = useGameStore(
    useShallow((state) => ({
      fetchGameDetails: state.fetchGameDetails,
      gameDetails: params.id ? state.gamesDetails[params.id] : undefined,
    })),
  );

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    if (gameDetails) return;

    fetchGameDetails(params.id);
  }, [params.id, gameDetails, fetchGameDetails]);

  if (!params.id) {
    navigate("/library");
    return null;
  }

  if (!gameDetails) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden px-4">
      <GameHero className="absolute inset-0 -z-10 h-full w-full" game={gameDetails} />
      <Game containerRef={containerRef} game={gameDetails} />
    </div>
  );
};

const Game = ({ containerRef, game }: { containerRef: RefObject<HTMLDivElement | null>; game: GameStoreModel }) => {
  const { t } = useTranslation();

  return (
    <>
      <GameHeader game={game} />
      <div className="h-full overflow-y-auto scrollbar-hide" ref={containerRef}>
        <div className="mb-[50px] mt-[100px]">
          <div className="mx-auto max-w-screen-2xl px-6">
            <h1
              className="mb-4 line-clamp-3 max-w-[900px] text-[50px] font-black leading-[1.1] text-white/70 drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
              title={game.name}
            >
              {game.name}
            </h1>
            <div className="mb-8 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <IncompatibilityIcon />
                <LibraryIcon game={game} size="xl" />
                {game.library === "steam" && <ProtonIcon gameId={game?.gameId} platforms={game.platforms} size="xl" />}
              </div>
            </div>

            {game.summary && (
              <main>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <ContentCard className="h-full" title={t("gameDetails.summary")}>
                      <Spoiler maxHeight={300}>
                        <p className="text-neutral-200">{game.summary}</p>
                      </Spoiler>
                    </ContentCard>
                  </div>
                  <div className="lg:col-span-7">
                    <div className="aspect-video w-full overflow-hidden rounded-2xl">
                      <MediaCarousel height="100%" images={game.screenshots} videos={game.videos} />
                    </div>
                  </div>
                  <div className="lg:col-span-12">
                    <ContentCard title={t("gameDetails.details")}>
                      <GameDetailsTable game={game} />
                    </ContentCard>
                  </div>
                  <div className="lg:col-span-12">
                    <ContentCard title={t("gameDetails.links")}>
                      <GameLinks websites={game.websites} />
                    </ContentCard>
                  </div>
                  <div className="lg:col-span-12">
                    <div className="flex justify-end pr-4">
                      <div className="min-w-[200px]">
                        <div className="flex justify-between gap-8 py-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            {t("game.gameId")}
                          </span>
                          <span className="select-all font-mono text-[10px] text-neutral-400">{game.gameId}</span>
                        </div>
                        <div className="flex justify-between gap-8 py-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            {t("game.igdbId")}
                          </span>
                          <span className="select-all font-mono text-[10px] text-neutral-400">{game.igdbId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { FeaturedGameModel } from "@stakload/contracts/database/games";
import { IconInfoCircle, IconPlayerPlay } from "@tabler/icons-react";
import { ReactNode } from "react";
import { NavLink } from "react-router";

type HomeHeroProps = {
  game: FeaturedGameModel;
  children?: ReactNode;
};

export const HomeHero = ({ children, game }: HomeHeroProps) => {
  const screenshot = game.screenshots?.[0] ?? "https://images.igdb.com/igdb/image/upload/t_1080p/ar4jgj.webp";

  return (
    <div className="relative flex min-h-full w-full flex-col justify-end">
      <div className="absolute inset-0 z-0 h-full w-full">
        {screenshot && <img alt={game.name} className="absolute inset-0 h-full w-full object-cover" src={screenshot} />}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      <div className="relative z-20 flex w-full max-w-5xl flex-col px-12 pb-8">
        <Heading
          className="mb-4 line-clamp-2 text-7xl leading-none tracking-tight text-white drop-shadow-lg [text-shadow:var(--text-shadow-gold)]"
          title={game.name}
        >
          {game.name}
        </Heading>

        <div className="flex items-center gap-6">
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            {game.genres?.map((g) => g.name).join(" | ")}
          </p>
        </div>

        <div className="mt-10 flex gap-4">
          <Button
            className="gap-3 px-8 py-4 text-sm font-black tracking-widest uppercase"
            leftIcon={IconPlayerPlay}
            size="lg"
          >
            Launch Game
          </Button>
          <Button
            variant="ghost"
            className="gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase"
            leftIcon={IconInfoCircle}
            nativeButton={false}
            render={<NavLink to={`/library/${game._id}`} />}
            size="lg"
          >
            Details
          </Button>
        </div>
      </div>

      {children && <div className="h-sm:pt-8 h-md:pt-32 h-lg:pt-64 relative z-20 w-full pb-12">{children}</div>}
    </div>
  );
};

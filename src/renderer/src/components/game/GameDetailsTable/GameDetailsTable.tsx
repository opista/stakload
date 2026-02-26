import { GameStoreModel } from "@contracts/database/games";
import { ParseKeys, TFunction } from "i18next";
import { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { GameDetailsTableRow } from "./GameDetailsTableRow";

type Column = {
  formatter: (game: GameStoreModel, t: TFunction) => ReactNode | string | undefined;
  label: ParseKeys;
};

type GameDetailsTableProps = {
  game: GameStoreModel;
};

const firstColumn: Column[] = [
  {
    formatter: ({ firstReleaseDate }: GameStoreModel) =>
      firstReleaseDate &&
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(firstReleaseDate)),
    label: "gameDetails.releaseDate",
  },
  {
    formatter: ({ ageRatings }: GameStoreModel) => {
      if (!ageRatings) return;
      return ageRatings.map(({ name }) => name).join(", ");
    },
    label: "gameDetails.ageRating",
  },
  {
    formatter: ({ developers }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {developers?.map((developer) => (
          <span key={developer.id}>{developer.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.developers",
  },
  {
    formatter: ({ publishers }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {publishers?.map((publisher) => (
          <span key={publisher.id}>{publisher.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.publishers",
  },
  {
    formatter: ({ gameModes }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {gameModes?.map((mode) => (
          <span key={mode.id}>{mode.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.gameModes",
  },
];

const secondColumn: Column[] = [
  {
    formatter: ({ genres }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {genres?.map((genre) => (
          <span key={genre.id}>{genre.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.genres",
  },
  {
    formatter: ({ platforms }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {platforms?.map((platform) => (
          <span key={platform.id}>{platform.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.platforms",
  },
  {
    formatter: ({ playerPerspectives }: GameStoreModel) => (
      <div className="flex flex-col text-right">
        {playerPerspectives?.map((perspective) => (
          <span key={perspective.id}>{perspective.name}</span>
        ))}
      </div>
    ),
    label: "gameDetails.perspectives",
  },
];

export const GameDetailsTable = ({ game }: GameDetailsTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between gap-8">
      <div className="flex-1">
        {firstColumn.map(({ formatter, label }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game, t)} />
            <div className="my-1 border-t border-neutral-700/50" />
          </Fragment>
        ))}
      </div>
      <div className="flex-1">
        {secondColumn.map(({ formatter, label }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game, t)} />
            <div className="my-1 border-t border-neutral-700/50" />
          </Fragment>
        ))}
      </div>
    </div>
  );
};


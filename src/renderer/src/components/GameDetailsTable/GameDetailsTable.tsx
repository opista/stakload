import { GameStoreModel } from "@contracts/database/games";
import { Divider, Flex } from "@mantine/core";
import { ParseKeys, TFunction } from "i18next";
import { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import classes from "./GameDetailsTable.module.css";
import { GameDetailsTableRow } from "./GameDetailsTableRow/GameDetailsTableRow";

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
      <>
        {developers?.map((developer) => (
          <span className={classes.valueStack} key={developer.id}>
            {developer.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.developers",
  },
  {
    formatter: ({ publishers }: GameStoreModel) => (
      <>
        {publishers?.map((publisher) => (
          <span className={classes.valueStack} key={publisher.id}>
            {publisher.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.publishers",
  },
  {
    formatter: ({ gameModes }: GameStoreModel) => (
      <>
        {gameModes?.map((mode) => (
          <span className={classes.valueStack} key={mode.id}>
            {mode.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.gameModes",
  },
];

const secondColumn: Column[] = [
  {
    formatter: ({ genres }: GameStoreModel) => (
      <>
        {genres?.map((genre) => (
          <span className={classes.valueStack} key={genre.id}>
            {genre.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.genres",
  },
  {
    formatter: ({ platforms }: GameStoreModel) => (
      <>
        {platforms?.map((platform) => (
          <span className={classes.valueStack} key={platform.id}>
            {platform.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.platforms",
  },
  {
    formatter: ({ playerPerspectives }: GameStoreModel) => (
      <>
        {playerPerspectives?.map((perspective) => (
          <span className={classes.valueStack} key={perspective.id}>
            {perspective.name}
          </span>
        ))}
      </>
    ),
    label: "gameDetails.perspectives",
  },
];

export const GameDetailsTable = ({ game }: GameDetailsTableProps) => {
  const { t } = useTranslation();

  return (
    <Flex gap="lg" justify="space-between">
      <div className={classes.column}>
        {firstColumn.map(({ label, formatter }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game, t)} />
            <Divider classNames={{ root: classes.divider }} />
          </Fragment>
        ))}
      </div>
      <div className={classes.column}>
        {secondColumn.map(({ label, formatter }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game, t)} />
            <Divider classNames={{ root: classes.divider }} />
          </Fragment>
        ))}
      </div>
    </Flex>
  );
};

import { GameStoreModel } from "@contracts/database/games";
import { Divider, Flex } from "@mantine/core";
import { ParseKeys } from "i18next";
import { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import classes from "./GameDetailsTable.module.css";
import { GameDetailsTableRow } from "./GameDetailsTableRow/GameDetailsTableRow";

type Column = {
  label: ParseKeys;
  formatter: (game: GameStoreModel) => ReactNode | string | undefined;
};

type GameDetailsTableProps = {
  game: GameStoreModel;
};

const firstColumn: Column[] = [
  {
    label: "gameDetails.releaseDate",
    formatter: ({ firstReleaseDate }: GameStoreModel) =>
      firstReleaseDate &&
      new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(firstReleaseDate)),
  },
  {
    label: "gameDetails.ageRating",
    formatter: ({ ageRating }: GameStoreModel) => ageRating,
  },
  {
    label: "gameDetails.developers",
    formatter: ({ developers }: GameStoreModel) => (
      <>
        {developers?.map((developer) => (
          <span className={classes.valueStack} key={developer.id}>
            {developer.name}
          </span>
        ))}
      </>
    ),
  },
  {
    label: "gameDetails.publishers",
    formatter: ({ publishers }: GameStoreModel) => (
      <>
        {publishers?.map((publisher) => (
          <span className={classes.valueStack} key={publisher.id}>
            {publisher.name}
          </span>
        ))}
      </>
    ),
  },
  {
    label: "gameDetails.gameModes",
    formatter: ({ gameModes }: GameStoreModel) => (
      <>
        {gameModes?.map((mode) => (
          <span className={classes.valueStack} key={mode.id}>
            {mode.name}
          </span>
        ))}
      </>
    ),
  },
];

const secondColumn: Column[] = [
  {
    label: "gameDetails.genres",
    formatter: ({ genres }: GameStoreModel) => (
      <>
        {genres?.map((genre) => (
          <span className={classes.valueStack} key={genre.id}>
            {genre.name}
          </span>
        ))}
      </>
    ),
  },
  {
    label: "gameDetails.platforms",
    formatter: ({ platforms }: GameStoreModel) => (
      <>
        {platforms?.map((platform) => (
          <span className={classes.valueStack} key={platform.id}>
            {platform.name}
          </span>
        ))}
      </>
    ),
  },
  {
    label: "gameDetails.perspectives",
    formatter: ({ playerPerspectives }: GameStoreModel) => (
      <>
        {playerPerspectives?.map((perspective) => (
          <span className={classes.valueStack} key={perspective.id}>
            {perspective.name}
          </span>
        ))}
      </>
    ),
  },
];

export const GameDetailsTable = ({ game }: GameDetailsTableProps) => {
  const { t } = useTranslation();

  return (
    <Flex gap="lg" justify="space-between">
      <div className={classes.column}>
        {firstColumn.map(({ label, formatter }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game)} />
            <Divider classNames={{ root: classes.divider }} />
          </Fragment>
        ))}
      </div>
      <div className={classes.column}>
        {secondColumn.map(({ label, formatter }) => (
          <Fragment key={label}>
            <GameDetailsTableRow label={t(label)} value={formatter(game)} />
            <Divider classNames={{ root: classes.divider }} />
          </Fragment>
        ))}
      </div>
    </Flex>
  );
};

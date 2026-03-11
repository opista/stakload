import type { GameDto } from "../../models/dto/game.dto";

export type RawAggregatedGameDto = Omit<GameDto, "firstReleaseDate"> & {
  firstReleaseDate: number | string | null;
};

const parseFirstReleaseDate = (value: number | string | null): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const mapAggregatedGameToDto = (rawGame: RawAggregatedGameDto | string): GameDto => {
  let parsedGame: RawAggregatedGameDto;

  if (typeof rawGame === "string") {
    try {
      parsedGame = JSON.parse(rawGame) as RawAggregatedGameDto;
    } catch (error) {
      throw new Error("Failed to parse aggregated game payload from Postgres", {
        cause: error,
      });
    }
  } else {
    parsedGame = rawGame;
  }

  return {
    ...parsedGame,
    firstReleaseDate: parseFirstReleaseDate(parsedGame.firstReleaseDate),
  };
};

import type { GameCacheReferenceKind } from "./reference-kinds";

export const GAME_BUILD_QUEUE_NAME = "game-build-queue";
export const GAME_BUILD_JOB_NAME = "game-build";
export const GAME_BUILD_IN_PROGRESS_SET_KEY = "game-build:in-progress";

export interface GameBuildJobPayload {
  gameId: number;
}

export const buildGameBuildJobId = (gameId: number): string => `game-build:${gameId}`;
export const buildGameBuildRequestedVersionKey = (gameId: number): string =>
  `game-build:${gameId}:requested-version`;
export const buildGameBuildAttemptedVersionKey = (gameId: number): string =>
  `game-build:${gameId}:attempted-version`;
export const buildGameBuildJobOptions = (gameId: number) => ({
  jobId: buildGameBuildJobId(gameId),
  removeOnComplete: true,
  removeOnFail: true,
});

export const buildGameCacheKey = (gameId: number): string => `game:${gameId}`;

export const buildGameDependencyIndexKey = (gameId: number): string => `game:${gameId}:dependency-keys`;

export const buildGameDependencySetKey = (
  referenceKind: GameCacheReferenceKind,
  referenceId: number,
): string => `${referenceKind}:${referenceId}:games`;

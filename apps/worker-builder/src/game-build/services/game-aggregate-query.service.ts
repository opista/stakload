import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import {
  GAME_AGGREGATE_QUERY_BY_IDS,
  mapGameBuildRows,
  type GameBuildQueryRow,
  type GameDto,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";

@Injectable()
export class GameAggregateQueryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async fetchByGameId(gameId: number): Promise<GameDto | null> {
    const rows = await this.fetchRowsByGameIds([gameId]);
    const games = this.mapRows(rows, gameId);

    return games.at(0) ?? null;
  }

  async fetchByGameIds(gameIds: number[]): Promise<GameDto[]> {
    if (!gameIds.length) return [];

    const rows = await this.fetchRowsByGameIds(gameIds);
    return this.mapRows(rows);
  }

  private async fetchRowsByGameIds(gameIds: number[]): Promise<GameBuildQueryRow[]> {
    return this.dataSource.query<GameBuildQueryRow[]>(GAME_AGGREGATE_QUERY_BY_IDS, [gameIds]);
  }

  private mapRows(rows: GameBuildQueryRow[], gameId?: number): GameDto[] {
    try {
      return mapGameBuildRows(rows);
    } catch (error) {
      this.logger.error({ err: error, gameId }, "Failed to map aggregated game payload");
      throw error;
    }
  }
}

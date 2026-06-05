import { BadRequestException, Controller, Get, Query } from "@nestjs/common";

import { isGameMetadataSource, type GameMetadata, type GameMetadataSource } from "@stakload/game-cache-contracts";

import { GamesService } from "./games.service";

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async listGames(
    @Query("source") source: string | undefined,
    @Query("externalGameId") externalGameId: string | string[] | undefined,
  ): Promise<GameMetadata[]> {
    if (!source || !isGameMetadataSource(source)) {
      throw new BadRequestException("Unsupported game metadata source");
    }

    const externalGameIds = typeof externalGameId === "string" ? [externalGameId] : (externalGameId ?? []);
    const normalisedExternalGameIds = externalGameIds.map((id) => id.trim()).filter((id) => id.length > 0);

    if (!normalisedExternalGameIds.length) {
      throw new BadRequestException("At least one externalGameId query parameter is required");
    }

    return this.gamesService.findByExternalIds(source as GameMetadataSource, normalisedExternalGameIds);
  }
}

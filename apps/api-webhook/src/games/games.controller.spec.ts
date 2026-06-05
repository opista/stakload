import { BadRequestException } from "@nestjs/common";
import { Mocked, TestBed } from "@suites/unit";

import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

describe("GamesController", () => {
  let controller: GamesController;
  let service: Mocked<GamesService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GamesController).compile();

    controller = unit;
    service = unitRef.get(GamesService);
  });

  it("should return game metadata for repeated external game ids", async () => {
    void service.findByExternalIds.mockResolvedValue([
      {
        externalGameId: "570",
        igdbId: 42,
        name: "Dota 2",
        sortableName: "Dota 2",
        source: "steam",
      },
    ]);

    await expect(controller.listGames("steam", ["570", "730"])).resolves.toEqual([
      {
        externalGameId: "570",
        igdbId: 42,
        name: "Dota 2",
        sortableName: "Dota 2",
        source: "steam",
      },
    ]);

    expect(service.findByExternalIds).toHaveBeenCalledWith("steam", ["570", "730"]);
  });

  it("should normalise a single external game id", async () => {
    void service.findByExternalIds.mockResolvedValue([]);

    await expect(controller.listGames("gog", "1234")).resolves.toEqual([]);

    expect(service.findByExternalIds).toHaveBeenCalledWith("gog", ["1234"]);
  });

  it("should reject unsupported sources", async () => {
    await expect(controller.listGames("battle-net", "wow")).rejects.toBeInstanceOf(BadRequestException);
    expect(service.findByExternalIds).not.toHaveBeenCalled();
  });

  it("should reject requests without external game ids", async () => {
    await expect(controller.listGames("steam", undefined)).rejects.toBeInstanceOf(BadRequestException);
    expect(service.findByExternalIds).not.toHaveBeenCalled();
  });
});

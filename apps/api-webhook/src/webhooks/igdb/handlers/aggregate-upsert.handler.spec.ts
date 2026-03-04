import { Mocked, TestBed } from "@suites/unit";
import { DataSource } from "typeorm";

import { IgdbUpsertService } from "../services/igdb-upsert.service";
import { AggregateUpsertHandler } from "./aggregate-upsert.handler";

const createQueryRunner = () => ({
  commitTransaction: vi.fn().mockResolvedValue(undefined),
  connect: vi.fn().mockResolvedValue(undefined),
  manager: {},
  query: vi.fn().mockResolvedValue(undefined),
  release: vi.fn().mockResolvedValue(undefined),
  rollbackTransaction: vi.fn().mockResolvedValue(undefined),
  startTransaction: vi.fn().mockResolvedValue(undefined),
});

describe("AggregateUpsertHandler", () => {
  let dataSource: Mocked<DataSource>;
  let handler: AggregateUpsertHandler;
  let upsertService: Mocked<IgdbUpsertService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AggregateUpsertHandler).compile();

    handler = unit;
    dataSource = unitRef.get(DataSource);
    upsertService = unitRef.get(IgdbUpsertService);
  });

  it("should upsert, replace relations, and commit when the write is applied", async () => {
    const queryRunner = createQueryRunner();
    const payload = { id: 42, name: "Game" };
    const definition = {
      entity: class GameEntity {},
      kind: "aggregate" as const,
      map: vi.fn().mockReturnValue({ igdbId: 42, name: "Game" }),
      replaceRelations: vi.fn().mockResolvedValue(undefined),
      resource: "games" as const,
      staleProtection: "stale_protected" as const,
    };

    dataSource.createQueryRunner.mockReturnValue(queryRunner as never);
    void vi.spyOn(upsertService, "upsert").mockResolvedValue(true);

    await expect(handler.handle(definition, payload)).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(queryRunner.connect).toHaveBeenCalledTimes(1);
    expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.query).toHaveBeenCalledTimes(1);
    expect(upsertService.upsert).toHaveBeenCalledWith(
      definition.entity,
      { igdbId: 42, name: "Game" },
      "stale_protected",
      queryRunner,
    );
    expect(definition.replaceRelations).toHaveBeenCalledWith({
      manager: queryRunner.manager,
      payload,
      resource: "games",
      rootId: 42,
    });
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
  });

  it("should skip relation replacement and return rejected_stale when the write is stale", async () => {
    const queryRunner = createQueryRunner();
    const definition = {
      entity: class GameEntity {},
      kind: "aggregate" as const,
      map: vi.fn().mockReturnValue({ igdbId: 42 }),
      replaceRelations: vi.fn().mockResolvedValue(undefined),
      resource: "games" as const,
      staleProtection: "stale_protected" as const,
    };

    dataSource.createQueryRunner.mockReturnValue(queryRunner as never);
    void vi.spyOn(upsertService, "upsert").mockResolvedValue(false);

    await expect(handler.handle(definition, { id: 42 })).resolves.toEqual({
      outcome: "rejected_stale",
      statusCode: 204,
    });

    expect(definition.replaceRelations).not.toHaveBeenCalled();
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
  });
});

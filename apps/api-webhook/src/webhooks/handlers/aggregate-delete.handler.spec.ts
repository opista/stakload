import { Mocked, TestBed } from "@suites/unit";
import { DataSource } from "typeorm";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";
import { AggregateDeleteHandler } from "./aggregate-delete.handler";

const createQueryRunner = () => ({
  commitTransaction: vi.fn().mockResolvedValue(undefined),
  connect: vi.fn().mockResolvedValue(undefined),
  manager: {
    delete: vi.fn().mockResolvedValue(undefined),
  },
  query: vi.fn().mockResolvedValue(undefined),
  release: vi.fn().mockResolvedValue(undefined),
  rollbackTransaction: vi.fn().mockResolvedValue(undefined),
  startTransaction: vi.fn().mockResolvedValue(undefined),
});

describe("AggregateDeleteHandler", () => {
  let dataSource: Mocked<DataSource>;
  let handler: AggregateDeleteHandler;
  let tombstoneService: Mocked<IgdbTombstoneService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AggregateDeleteHandler).compile();

    handler = unit;
    dataSource = unitRef.get(DataSource);
    tombstoneService = unitRef.get(IgdbTombstoneService);
  });

  it("should remove relations, delete the root row, and record a tombstone", async () => {
    const queryRunner = createQueryRunner();
    const definition = {
      entity: class GameEntity {},
      kind: "aggregate" as const,
      map: vi.fn(),
      replaceRelations: vi.fn().mockResolvedValue(undefined),
      resource: "games" as const,
      staleProtection: "stale_protected" as const,
    };

    dataSource.createQueryRunner.mockReturnValue(queryRunner as never);

    await expect(handler.handle(definition, 42)).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(queryRunner.query).toHaveBeenCalledTimes(1);
    expect(definition.replaceRelations).toHaveBeenCalledWith({
      manager: queryRunner.manager,
      payload: {},
      resource: "games",
      rootId: 42,
    });
    expect(queryRunner.manager.delete).toHaveBeenCalledWith(definition.entity, { igdbId: 42 });
    expect(tombstoneService.recordDeletion).toHaveBeenCalledWith("games", 42, queryRunner.manager);
    expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
  });
});

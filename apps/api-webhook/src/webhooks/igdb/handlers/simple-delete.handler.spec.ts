import { Mocked, TestBed } from "@suites/unit";
import { DataSource } from "typeorm";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";
import { SimpleDeleteHandler } from "./simple-delete.handler";

describe("SimpleDeleteHandler", () => {
  let dataSource: Mocked<DataSource>;
  let handler: SimpleDeleteHandler;
  let tombstoneService: Mocked<IgdbTombstoneService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(SimpleDeleteHandler).compile();

    handler = unit;
    dataSource = unitRef.get(DataSource);
    tombstoneService = unitRef.get(IgdbTombstoneService);
  });

  it("should hard-delete the row and record a tombstone", async () => {
    const repository = {
      delete: vi.fn().mockResolvedValue(undefined),
    };
    const definition = {
      entity: class TestEntity {},
      kind: "simple" as const,
      map: vi.fn(),
      resource: "platforms" as const,
      staleProtection: "best_effort" as const,
    };

    dataSource.getRepository.mockReturnValue(repository as never);

    await expect(handler.handle(definition, 12)).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(repository.delete).toHaveBeenCalledWith({ igdbId: 12 });
    expect(tombstoneService.recordDeletion).toHaveBeenCalledWith("platforms", 12);
  });
});

import { Mocked, TestBed } from "@suites/unit";
import { DataSource } from "typeorm";

import { IgdbUpsertService } from "../services/igdb-upsert.service";
import { SimpleUpsertHandler } from "./simple-upsert.handler";

describe("SimpleUpsertHandler", () => {
  let dataSource: Mocked<DataSource>;
  let handler: SimpleUpsertHandler;
  let upsertService: Mocked<IgdbUpsertService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(SimpleUpsertHandler).compile();

    handler = unit;
    dataSource = unitRef.get(DataSource);
    upsertService = unitRef.get(IgdbUpsertService);
  });

  it("should upsert the mapped payload and return handled when applied", async () => {
    const repository = { delete: vi.fn() };
    const definition = {
      entity: class TestEntity {},
      kind: "simple" as const,
      map: vi.fn().mockReturnValue({ igdbId: 42, name: "Game" }),
      resource: "platforms" as const,
      staleProtection: "best_effort" as const,
    };
    const payload = { id: 42, name: "Game" };
    const upsert = vi.fn().mockResolvedValue(true);

    dataSource.getRepository.mockReturnValue(repository as never);
    Object.defineProperty(upsertService, "upsert", {
      configurable: true,
      value: upsert,
    });

    await expect(handler.handle(definition, payload)).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(dataSource.getRepository).toHaveBeenCalledWith(definition.entity);
    expect(definition.map).toHaveBeenCalledWith(payload);
    expect(upsert).toHaveBeenCalledWith(definition.entity, { igdbId: 42, name: "Game" }, "best_effort", repository);
  });

  it("should return rejected_stale when the upsert is not applied", async () => {
    const repository = { delete: vi.fn() };
    const definition = {
      entity: class TestEntity {},
      kind: "simple" as const,
      map: vi.fn().mockReturnValue({ igdbId: 42 }),
      resource: "platforms" as const,
      staleProtection: "stale_protected" as const,
    };
    const upsert = vi.fn().mockResolvedValue(false);

    dataSource.getRepository.mockReturnValue(repository as never);
    Object.defineProperty(upsertService, "upsert", {
      configurable: true,
      value: upsert,
    });

    await expect(handler.handle(definition, { id: 42 })).resolves.toEqual({
      outcome: "rejected_stale",
      statusCode: 204,
    });
  });
});

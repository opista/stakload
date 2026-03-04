import type { ObjectLiteral, Repository } from "typeorm";

import { IgdbUpsertService } from "./igdb-upsert.service";

const createRepository = <TEntity extends ObjectLiteral>() =>
  ({
    create: vi.fn((payload: Partial<TEntity>) => payload),
    metadata: {
      columns: [
        {
          databaseName: "igdb_id",
          isCreateDate: false,
          isPrimary: true,
          isUpdateDate: false,
          propertyName: "igdbId",
        },
        {
          databaseName: "name",
          isCreateDate: false,
          isPrimary: false,
          isUpdateDate: false,
          propertyName: "name",
        },
        {
          databaseName: "source_updated_at",
          isCreateDate: false,
          isPrimary: false,
          isUpdateDate: false,
          propertyName: "sourceUpdatedAt",
        },
        {
          databaseName: "updated_at",
          isCreateDate: false,
          isPrimary: false,
          isUpdateDate: true,
          propertyName: "updatedAt",
        },
      ],
      findColumnWithPropertyName: vi.fn((propertyName: string) =>
        propertyName === "sourceUpdatedAt"
          ? {
              databaseName: "source_updated_at",
              propertyName: "sourceUpdatedAt",
            }
          : null,
      ),
      primaryColumns: [
        {
          databaseName: "igdb_id",
          propertyName: "igdbId",
        },
      ],
      tablePath: "games",
    },
    query: vi.fn().mockResolvedValue([{ igdb_id: 42 }]),
    save: vi.fn().mockResolvedValue(undefined),
  }) as unknown as Repository<TEntity>;

describe("IgdbUpsertService", () => {
  let service: IgdbUpsertService;

  beforeEach(() => {
    service = new IgdbUpsertService();
  });

  it("should use repository.save when stale protection is not enabled", async () => {
    const repository = createRepository<{ igdbId: number; name: string }>();
    const payload = { igdbId: 42, name: "Game" };

    await expect(service.upsert(class TestEntity {}, payload, "best_effort", repository)).resolves.toBe(true);

    expect(repository.create).toHaveBeenCalledWith(payload);
    expect(repository.save).toHaveBeenCalledWith(payload);
    expect(repository.query).not.toHaveBeenCalled();
  });

  it("should use repository.save when sourceUpdatedAt is missing", async () => {
    const repository = createRepository<{ igdbId: number; name: string }>();
    const payload = { igdbId: 42, name: "Game" };

    await expect(service.upsert(class TestEntity {}, payload, "stale_protected", repository)).resolves.toBe(true);

    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.query).not.toHaveBeenCalled();
  });

  it("should return false when no upsertable columns are present", async () => {
    const repository = createRepository<{ igdbId: number; updatedAt: Date; sourceUpdatedAt: Date }>();
    const payload = {
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-02T00:00:00.000Z"),
    };
    Object.defineProperty(repository, "metadata", {
      configurable: true,
      value: {
        ...repository.metadata,
        columns: [
          {
            databaseName: "updated_at",
            isCreateDate: false,
            isPrimary: false,
            isUpdateDate: true,
            propertyName: "updatedAt",
          },
        ],
        findColumnWithPropertyName: vi.fn(() => null),
      },
    });

    await expect(service.upsert(class TestEntity {}, payload, "stale_protected", repository)).resolves.toBe(false);

    expect(repository.query).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("should execute conditional SQL for stale-protected writes", async () => {
    const repository = createRepository<{ igdbId: number; name: string; sourceUpdatedAt: Date }>();
    const payload = {
      igdbId: 42,
      name: "Game",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };

    await expect(service.upsert(class TestEntity {}, payload, "stale_protected", repository)).resolves.toBe(true);

    expect(repository.query).toHaveBeenCalledTimes(1);
    expect(repository.save).not.toHaveBeenCalled();
    expect(repository.query).toHaveBeenCalledWith(expect.stringContaining("ON CONFLICT"), [
      42,
      "Game",
      payload.sourceUpdatedAt,
    ]);
  });

  it("should return false when the stale-protected query affects no rows", async () => {
    const repository = createRepository<{ igdbId: number; name: string; sourceUpdatedAt: Date }>();
    const payload = {
      igdbId: 42,
      name: "Game",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    };

    vi.mocked(repository.query).mockResolvedValue([]);

    await expect(service.upsert(class TestEntity {}, payload, "stale_protected", repository)).resolves.toBe(false);
  });
});

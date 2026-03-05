import { getRepositoryToken } from "@nestjs/typeorm";
import { Mocked, TestBed } from "@suites/unit";
import type { EntityManager, Repository } from "typeorm";

import { IgdbTombstoneEntity } from "../../../database/entities/igdb-tombstone.entity";
import { IgdbTombstoneService } from "./igdb-tombstone.service";

const createInsertQueryBuilder = () => ({
  execute: vi.fn().mockResolvedValue(undefined),
  insert: vi.fn().mockReturnThis(),
  into: vi.fn().mockReturnThis(),
  orIgnore: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
});

const createManager = () => {
  const queryBuilder = createInsertQueryBuilder();

  return {
    createQueryBuilder: vi.fn(() => queryBuilder),
    queryBuilder,
  };
};

describe("IgdbTombstoneService", () => {
  let repository: Mocked<Repository<IgdbTombstoneEntity>>;
  let service: IgdbTombstoneService;

  beforeEach(async () => {
    const repositoryToken = getRepositoryToken(IgdbTombstoneEntity);
    const manager = createManager();
    repository = {
      findOneBy: vi.fn(),
      manager,
    } as unknown as Mocked<Repository<IgdbTombstoneEntity>>;
    const { unit } = await TestBed.solitary(IgdbTombstoneService)
      .mock(repositoryToken as string)
      .final(repository)
      .compile();

    service = unit;
  });

  it("should report a tombstone when the repository finds one", async () => {
    vi.mocked(repository.findOneBy).mockResolvedValue({ igdbId: 42, resource: "games" } as never);

    await expect(service.isTombstoned("games", 42)).resolves.toBe(true);
    expect(repository.findOneBy).toHaveBeenCalledWith({ igdbId: 42, resource: "games" });
  });

  it("should report no tombstone when the repository returns null", async () => {
    void vi.mocked(repository.findOneBy).mockResolvedValue(null);

    await expect(service.isTombstoned("games", 42)).resolves.toBe(false);
  });

  it("should record deletions with the repository manager by default", async () => {
    const manager = createManager();
    Object.defineProperty(repository, "manager", {
      configurable: true,
      value: manager,
    });

    await service.recordDeletion("games", 42);

    expect(manager.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(manager.queryBuilder.insert).toHaveBeenCalledTimes(1);
    expect(manager.queryBuilder.into).toHaveBeenCalledWith(IgdbTombstoneEntity);
    expect(manager.queryBuilder.values).toHaveBeenCalledWith({ igdbId: 42, resource: "games" });
    expect(manager.queryBuilder.orIgnore).toHaveBeenCalledTimes(1);
    expect(manager.queryBuilder.execute).toHaveBeenCalledTimes(1);
  });

  it("should record deletions with an override manager when provided", async () => {
    const repositoryManager = createManager();
    const overrideManager = createManager();
    Object.defineProperty(repository, "manager", {
      configurable: true,
      value: repositoryManager,
    });

    await service.recordDeletion("platforms", 9, overrideManager as unknown as EntityManager);

    expect(repositoryManager.createQueryBuilder).not.toHaveBeenCalled();
    expect(overrideManager.createQueryBuilder).toHaveBeenCalledTimes(1);
    expect(overrideManager.queryBuilder.values).toHaveBeenCalledWith({
      igdbId: 9,
      resource: "platforms",
    });
  });
});

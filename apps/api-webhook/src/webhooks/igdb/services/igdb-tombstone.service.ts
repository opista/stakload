import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { EntityManager, Repository } from "typeorm";

import { IgdbTombstoneEntity } from "../../../database/entities/igdb-tombstone.entity";

@Injectable()
export class IgdbTombstoneService {
  constructor(
    @InjectRepository(IgdbTombstoneEntity)
    private readonly tombstoneRepository: Repository<IgdbTombstoneEntity>,
  ) {}

  async isTombstoned(resource: string, igdbId: number): Promise<boolean> {
    const tombstone = await this.tombstoneRepository.findOneBy({ igdbId, resource });

    return tombstone !== null;
  }

  async recordDeletion(resource: string, igdbId: number, manager?: EntityManager): Promise<void> {
    const entityManager = manager ?? this.tombstoneRepository.manager;

    await entityManager
      .createQueryBuilder()
      .insert()
      .into(IgdbTombstoneEntity)
      .values({ igdbId, resource })
      .orIgnore()
      .execute();
  }
}

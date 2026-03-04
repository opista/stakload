import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { EntityManager, Repository } from "typeorm";

import { PinoLogger } from "@stakload/nestjs-logging";

import { IgdbTombstoneEntity } from "../../../database/entities/igdb-tombstone.entity";

@Injectable()
export class IgdbTombstoneService {
  constructor(
    @InjectRepository(IgdbTombstoneEntity)
    private readonly tombstoneRepository: Repository<IgdbTombstoneEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async isTombstoned(resource: string, igdbId: number): Promise<boolean> {
    const tombstone = await this.tombstoneRepository.findOneBy({ igdbId, resource });
    const isTombstoned = tombstone !== null;

    this.logger.debug({ igdbId, isTombstoned, resource }, "Checked tombstone status");

    return isTombstoned;
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

    this.logger.info({ igdbId, resource }, "Recorded tombstone");
  }
}

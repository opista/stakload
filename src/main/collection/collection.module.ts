import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CollectionController } from "./collection.controller";
import { CollectionEntity } from "./collection.entity";
import { CollectionService } from "./collection.service";
import { CollectionStore } from "./collection.store";

@Module({
  controllers: [CollectionController],
  exports: [CollectionService, CollectionStore],
  imports: [TypeOrmModule.forFeature([CollectionEntity])],
  providers: [CollectionService, CollectionStore],
})
export class CollectionModule {}

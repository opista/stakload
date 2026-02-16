import { Module } from "@nestjs/common";

import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { CollectionStore } from "./collection.store";

@Module({
  controllers: [CollectionController],
  exports: [CollectionService, CollectionStore],
  imports: [],
  providers: [CollectionService, CollectionStore],
})
export class CollectionModule {}

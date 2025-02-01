import { Module } from "../util/module/module.decorator";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { CollectionStore } from "./collection.store";

@Module({
  providers: [CollectionController, CollectionStore, CollectionService],
})
export class CollectionModule {}

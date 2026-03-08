import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to collections.
 */
@Entity("game_collections")
@Index(["collectionId"])
export class GameCollectionEntity {
  @PrimaryColumn({ type: "integer" })
  collectionId!: number;

  @PrimaryColumn({ type: "integer" })
  gameId!: number;
}

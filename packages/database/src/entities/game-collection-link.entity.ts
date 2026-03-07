import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to collections.
 */
@Entity("game_collections")
@Index(["collection"])
export class GameCollectionLinkEntity {
  @PrimaryColumn({ type: "integer" })
  collection!: number;

  @PrimaryColumn({ type: "integer" })
  game!: number;
}

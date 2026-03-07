import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to keywords.
 */
@Entity("game_keywords")
@Index(["keyword"])
export class GameKeywordLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  keyword!: number;
}

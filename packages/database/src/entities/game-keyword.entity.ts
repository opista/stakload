import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to keywords.
 */
@Entity("game_keywords")
@Index(["keywordId"])
export class GameKeywordEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  keywordId!: number;
}

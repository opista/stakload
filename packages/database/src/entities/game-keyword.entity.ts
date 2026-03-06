import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_keywords")
@Index(["keywordId"])
export class GameKeywordEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  keywordId!: number;
}

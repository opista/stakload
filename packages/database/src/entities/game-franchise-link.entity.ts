import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to franchises.
 */
@Entity("game_franchises")
@Index(["franchise"])
export class GameFranchiseLinkEntity {
  @PrimaryColumn({ type: "integer" })
  franchise!: number;

  @PrimaryColumn({ type: "integer" })
  game!: number;
}

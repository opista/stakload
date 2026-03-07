import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to game mode definitions.
 */
@Entity("game_game_modes")
@Index(["gameMode"])
export class GameGameModeLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  gameMode!: number;
}

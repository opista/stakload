import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to game mode definitions.
 */
@Entity("game_modes")
@Index(["modeId"])
export class GameModeEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  modeId!: number;
}

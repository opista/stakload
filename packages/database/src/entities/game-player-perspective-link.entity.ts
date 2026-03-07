import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to player perspectives.
 */
@Entity("game_player_perspectives")
@Index(["playerPerspective"])
export class GamePlayerPerspectiveLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  playerPerspective!: number;
}

import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to platforms.
 */
@Entity("game_platforms")
@Index(["platform"])
export class GamePlatformLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  platform!: number;
}

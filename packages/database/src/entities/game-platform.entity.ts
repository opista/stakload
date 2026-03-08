import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to platforms.
 */
@Entity("game_platforms")
@Index(["platformId"])
export class GamePlatformEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  platformId!: number;
}

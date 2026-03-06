import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_platforms")
@Index(["platformId"])
export class GamePlatformEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  platformId!: number;
}

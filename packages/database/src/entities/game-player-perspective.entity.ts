import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_player_perspectives")
@Index(["playerPerspectiveId"])
export class GamePlayerPerspectiveEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  playerPerspectiveId!: number;
}

import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_franchises")
@Index(["franchiseId"])
export class GameFranchiseEntity {
  @PrimaryColumn({ type: "integer" })
  franchiseId!: number;

  @PrimaryColumn({ type: "integer" })
  gameId!: number;
}

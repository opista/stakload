import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("game_types")
export class GameTypeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  type!: string;
}

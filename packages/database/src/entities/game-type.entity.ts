import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game Type.
 */
@Entity("game_types")
export class GameTypeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "text" })
  /** The game type label */
  type!: string;
}

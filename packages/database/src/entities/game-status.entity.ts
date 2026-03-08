import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game Status.
 */
@Entity("game_statuses")
export class GameStatusEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "text" })
  /** The status label */
  status!: string;
}

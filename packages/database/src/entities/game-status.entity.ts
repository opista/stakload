import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Lifecycle status definitions for games.
 */
@Entity("game_statuses")
export class GameStatusEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  status!: string;
}

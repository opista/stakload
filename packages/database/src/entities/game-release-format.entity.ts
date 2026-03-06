import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Release format definitions used by external game records.
 */
@Entity("game_release_formats")
export class GameReleaseFormatEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  format!: string;
}

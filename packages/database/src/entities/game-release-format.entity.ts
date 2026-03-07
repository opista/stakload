import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game Release Format.
 */
@Entity("game_release_formats")
export class GameReleaseFormatEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "text" })
  /** The release format name */
  format!: string;
}

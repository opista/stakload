import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game Video.
 */
@Entity("game_videos")
@Index(["game"])
export class GameVideoEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The game this video is associated with */
  game?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The name of the video */
  name?: string | null;

  @Column({ nullable: true, type: "text" })
  /** The external ID of the video (YouTube Links) */
  videoId?: string | null;
}

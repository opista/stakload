import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("game_videos")
@Index(["gameId"])
export class GameVideoEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "text" })
  name?: string | null;

  @Column({ nullable: true, type: "text" })
  videoId?: string | null;
}

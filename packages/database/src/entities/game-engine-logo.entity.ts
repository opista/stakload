import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Logo media assets for game engines.
 */
@Entity("game_engine_logos")
export class GameEngineLogoEntity extends IgdbEntity {
  @Column({ nullable: true, type: "boolean" })
  alphaChannel?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  animated?: boolean | null;

  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  height?: number | null;

  @Column({ nullable: true, type: "text" })
  imageId?: string | null;

  @Column({ nullable: true, type: "text" })
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  width?: number | null;
}

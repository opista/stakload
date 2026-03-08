import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Cover.
 */
@Entity("covers")
export class CoverEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  /** The game this cover is associated with. If it is empty then this cover belongs to a game_localization, which can be found under game_localization field */
  game!: number;
}

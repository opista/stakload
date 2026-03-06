import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Cover media assets for games.
 */
@Entity("covers")
export class CoverEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

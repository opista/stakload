import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Screenshot media assets associated with games.
 */
@Entity("screenshots")
export class ScreenshotEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

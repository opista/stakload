import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Screenshot.
 */
@Entity("screenshots")
export class ScreenshotEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  /** The game this screenshot is associated with */
  game!: number;
}

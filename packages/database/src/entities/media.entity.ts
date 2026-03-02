import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

@Entity("artworks")
export class ArtworkEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

@Entity("covers")
export class CoverEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

@Entity("screenshots")
export class ScreenshotEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

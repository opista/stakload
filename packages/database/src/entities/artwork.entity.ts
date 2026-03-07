import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Artwork.
 */
@Entity("artworks")
export class ArtworkEntity extends ImageAssetEntity {
  @Column({ nullable: true, type: "integer" })
  /** The type of artwork */
  artworkType?: number | null;

  @Column({ type: "integer" })
  /** The game this artwork is associated with */
  game!: number;
}

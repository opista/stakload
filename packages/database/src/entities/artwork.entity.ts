import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Artwork media assets associated with games.
 */
@Entity("artworks")
export class ArtworkEntity extends ImageAssetEntity {
  @Column({ nullable: true, type: "integer" })
  artworkTypeId?: number | null;

  @Column({ type: "integer" })
  gameId!: number;
}

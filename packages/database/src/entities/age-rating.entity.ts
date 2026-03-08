import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Age Rating according to various rating organisations.
 */
@Entity("age_ratings")
export class AgeRatingEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The organisation that issued this rating */
  organization?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The category of this rating */
  ratingCategory?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** The rating content descriptions */
  ratingContentDescriptions?: number[] | null;

  @Column({ nullable: true, type: "text" })
  /** The url for the image of a age rating */
  ratingCoverUrl?: string | null;

  @Column({ nullable: true, type: "text" })
  /** A free text motivating a rating */
  synopsis?: string | null;
}

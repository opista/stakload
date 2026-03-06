import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Age ratings assigned to games by rating organisations.
 */
@Entity("age_ratings")
export class AgeRatingEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  organizationId?: number | null;

  @Column({ nullable: true, type: "integer" })
  ratingCategoryId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  ratingContentDescriptionIds?: number[] | null;

  @Column({ nullable: true, type: "text" })
  ratingCoverUrl?: string | null;

  @Column({ nullable: true, type: "text" })
  synopsis?: string | null;
}

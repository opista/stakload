import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Rating category definitions used by age rating organisations.
 */
@Entity("age_rating_categories")
export class AgeRatingCategoryEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  organizationId?: number | null;

  @Column({ nullable: true, type: "text" })
  rating?: string | null;
}

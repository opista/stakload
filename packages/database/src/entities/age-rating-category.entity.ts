import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Age Rating Category.
 */
@Entity("age_rating_categories")
export class AgeRatingCategoryEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The organization this rating category is associated with */
  organization?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The rating name */
  rating?: string | null;
}

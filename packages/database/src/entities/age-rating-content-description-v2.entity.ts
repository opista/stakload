import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Age Rating Content Description V2.
 */
@Entity("age_rating_content_descriptions_v2")
export class AgeRatingContentDescriptionV2Entity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  /** A string containing the age rating content descriptions */
  description?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The organization this content description belongs to */
  organization?: number | null;
}

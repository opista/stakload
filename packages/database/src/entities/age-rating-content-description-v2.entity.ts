import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("age_rating_content_descriptions_v2")
export class AgeRatingContentDescriptionV2Entity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  description?: string | null;

  @Column({ nullable: true, type: "integer" })
  organizationId?: number | null;
}

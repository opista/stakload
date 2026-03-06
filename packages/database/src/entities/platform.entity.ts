import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Platform records for hardware and operating environments.
 */
@Entity("platforms")
export class PlatformEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  abbreviation?: string | null;

  @Column({ nullable: true, type: "text" })
  alternativeName?: string | null;

  @Column({ nullable: true, type: "integer" })
  generation?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformFamilyId?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformLogoId?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformTypeId?: number | null;

  @Column({ nullable: true, type: "text" })
  summary?: string | null;
}

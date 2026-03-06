import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Video game companies involved in development and publishing.
 */
@Entity("companies")
export class CompanyEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "integer" })
  changeDateFormatId?: number | null;

  @Column({ nullable: true, type: "integer" })
  changedCompanyId?: number | null;

  @Column({ nullable: true, type: "integer" })
  country?: number | null;

  @Column({ nullable: true, type: "text" })
  description?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  developedGameIds?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  logoId?: number | null;

  @Column({ nullable: true, type: "integer" })
  parentId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  publishedGameIds?: number[] | null;

  @Column({ nullable: true, type: "timestamptz" })
  startDate?: Date | null;

  @Column({ nullable: true, type: "integer" })
  startDateFormatId?: number | null;

  @Column({ nullable: true, type: "integer" })
  statusId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  websiteIds?: number[] | null;
}

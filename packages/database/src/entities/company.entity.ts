import { Column, Entity } from "typeorm";

import { ImageAssetEntity, NamedEntity, SluggedNamedEntity } from "./base.entity";

@Entity("companies")
export class CompanyEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "integer" })
  changeDateFormatId?: number | null;

  @Column({ nullable: true, type: "integer" })
  changedCompanyId?: number | null;

  @Column({ nullable: true, type: "integer" })
  companySizeId?: number | null;

  @Column({ nullable: true, type: "integer" })
  country?: number | null;

  @Column({ nullable: true, type: "text" })
  description?: string | null;

  @Column({ nullable: true, type: "integer" })
  logoId?: number | null;

  @Column({ nullable: true, type: "integer" })
  parentId?: number | null;

  @Column({ nullable: true, type: "timestamptz" })
  startDate?: Date | null;

  @Column({ nullable: true, type: "integer" })
  startDateFormatId?: number | null;

  @Column({ nullable: true, type: "integer" })
  statusId?: number | null;
}

@Entity("company_logos")
export class CompanyLogoEntity extends ImageAssetEntity {}

@Entity("company_statuses")
export class CompanyStatusEntity extends NamedEntity {}

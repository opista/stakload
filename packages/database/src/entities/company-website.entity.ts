import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Website records associated with companies.
 */
@Entity("company_websites")
export class CompanyWebsiteEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "boolean" })
  trusted?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  typeId?: number | null;

  @Column({ type: "text" })
  url!: string;
}

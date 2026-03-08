import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Website Type.
 */
@Entity("website_types")
export class WebsiteTypeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "text" })
  /** The website type */
  type!: string;
}

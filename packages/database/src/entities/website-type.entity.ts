import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("website_types")
export class WebsiteTypeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  type!: string;
}

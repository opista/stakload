import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Date format definitions used by dated IGDB fields.
 */
@Entity("date_formats")
export class DateFormatEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  format!: string;
}

import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Date Format.
 */
@Entity("date_formats")
export class DateFormatEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "text" })
  /** The date format in plain text */
  format!: string;
}

import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Language definitions used by language support records.
 */
@Entity("languages")
export class LanguageEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  name!: string;

  @Column({ nullable: true, type: "text" })
  nativeName?: string | null;

  @Column({ nullable: true, type: "text" })
  locale?: string | null;
}

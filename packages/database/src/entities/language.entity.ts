import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Language.
 */
@Entity("languages")
export class LanguageEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  /** The combination of Language code and Country code */
  locale?: string | null;

  @Column({ type: "text" })
  /** The English name of the Language */
  name!: string;

  @Column({ nullable: true, type: "text" })
  /** The Native Name of the Language */
  nativeName?: string | null;
}

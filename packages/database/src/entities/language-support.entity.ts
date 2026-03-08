import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Language Support.
 */
@Entity("language_supports")
export class LanguageSupportEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The game this language support entry is associated with */
  game?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The language supported by the game */
  language?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The type of language support */
  languageSupportType?: number | null;
}

import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Per-game language support capability records.
 */
@Entity("language_supports")
export class LanguageSupportEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "integer" })
  languageId?: number | null;

  @Column({ nullable: true, type: "integer" })
  languageSupportTypeId?: number | null;
}

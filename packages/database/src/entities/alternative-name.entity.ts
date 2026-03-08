import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Alternative Name.
 */
@Entity("alternative_names")
export class AlternativeNameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  /** A description of what kind of alternative name it is (Acronym, Working title, Japanese title etc) */
  comment?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The game this alternative name is associated with */
  game?: number | null;

  @Column({ type: "text" })
  /** An alternative name */
  name!: string;
}

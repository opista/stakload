import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Alternative names and titles for games.
 */
@Entity("alternative_names")
export class AlternativeNameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  comment?: string | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ type: "text" })
  name!: string;
}

import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Collections that group related games.
 */
@Entity("collections")
export class CollectionEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  description?: string | null;
}

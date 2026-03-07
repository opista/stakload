import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Collection.
 */
@Entity("collections")
export class CollectionEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  /** Description of the collection */
  description?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  /** The games that are associated with this collection */
  games?: number[] | null;
}

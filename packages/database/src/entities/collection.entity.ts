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

  @Column({ array: true, nullable: true, type: "int" })
  /** The games that are associated with this collection */
  games?: number[] | null;
}

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
}

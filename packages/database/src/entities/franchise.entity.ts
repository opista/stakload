import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Franchise.
 */
@Entity("franchises")
export class FranchiseEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "simple-json" })
  /** The games that are associated with this franchise */
  games?: number[] | null;
}

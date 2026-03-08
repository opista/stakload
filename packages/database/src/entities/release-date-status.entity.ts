import { Column, Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Release Date Status.
 */
@Entity("release_date_statuses")
export class ReleaseDateStatusEntity extends NamedEntity {
  @Column({ nullable: true, type: "text" })
  /** The description of the release date status. */
  description?: string | null;
}

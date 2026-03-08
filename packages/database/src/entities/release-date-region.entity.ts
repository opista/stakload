import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Release Date Region.
 */
@Entity("release_date_regions")
export class ReleaseDateRegionEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  /** The release date region name */
  region?: string | null;
}

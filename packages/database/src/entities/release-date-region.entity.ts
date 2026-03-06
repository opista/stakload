import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("release_date_regions")
export class ReleaseDateRegionEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  region?: string | null;
}

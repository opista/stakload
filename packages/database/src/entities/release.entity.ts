import { Column, Entity } from "typeorm";

import { IgdbEntity, NamedEntity } from "./base.entity";

@Entity("release_dates")
export class ReleaseDateEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "date" })
  date?: string | null;

  @Column({ nullable: true, type: "integer" })
  dateFormatId?: number | null;

  @Column({ nullable: true, type: "integer" })
  day?: number | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "text" })
  human?: string | null;

  @Column({ nullable: true, type: "integer" })
  month?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformId?: number | null;

  @Column({ nullable: true, type: "integer" })
  releaseRegionId?: number | null;

  @Column({ nullable: true, type: "integer" })
  statusId?: number | null;

  @Column({ nullable: true, type: "integer" })
  year?: number | null;
}

@Entity("release_date_regions")
export class ReleaseDateRegionEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "text" })
  region?: string | null;
}

@Entity("release_date_statuses")
export class ReleaseDateStatusEntity extends NamedEntity {
  @Column({ nullable: true, type: "text" })
  description?: string | null;
}

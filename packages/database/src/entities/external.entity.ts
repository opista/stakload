import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("external_games")
export class ExternalGameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  countries?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  externalGameSourceId?: number | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "integer" })
  gameReleaseFormatId?: number | null;

  @Column({ nullable: true, type: "text" })
  name?: string | null;

  @Column({ nullable: true, type: "integer" })
  platformId?: number | null;

  @Column({ nullable: true, type: "text" })
  uid?: string | null;

  @Column({ nullable: true, type: "text" })
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  year?: number | null;
}

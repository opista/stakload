import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("multiplayer_modes")
@Index(["gameId"])
@Index(["platformId"])
export class MultiplayerModeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "boolean" })
  campaignCoop?: boolean | null;

  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "boolean" })
  dropIn?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "boolean" })
  lanCoop?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  offlineCoop?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  offlineCoopMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  offlineMax?: number | null;

  @Column({ nullable: true, type: "boolean" })
  onlineCoop?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  onlineCoopMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  onlineMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformId?: number | null;

  @Column({ nullable: true, type: "boolean" })
  splitScreen?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  splitScreenOnline?: boolean | null;
}

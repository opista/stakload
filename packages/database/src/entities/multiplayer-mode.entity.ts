import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Multiplayer Mode.
 */
@Entity("multiplayer_modes")
@Index(["game"])
@Index(["platform"])
export class MultiplayerModeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports campaign coop */
  campaignCoop?: boolean | null;

  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports drop in/out multiplayer */
  dropIn?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  /** The game this multiplayer mode is associated with */
  game?: number | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports LAN coop */
  lanCoop?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports offline coop */
  offlineCoop?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  /** Maximum number of offline players in offline coop */
  offlineCoopMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Maximum number of players in offline multiplayer */
  offlineMax?: number | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports online coop */
  onlineCoop?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  /** Maximum number of online players in online coop */
  onlineCoopMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Maximum number of players in online multiplayer */
  onlineMax?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The platform this multiplayer mode refers to */
  platform?: number | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports split screen, offline multiplayer */
  splitScreen?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  /** True if the game supports split screen, online multiplayer */
  splitScreenOnline?: boolean | null;
}

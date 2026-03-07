import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game IDs on other services.
 */
@Entity("external_games")
export class ExternalGameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  /** The ISO country code of the external game product. */
  countries?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  /** The id of the other service */
  externalGameSource?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The IGDB ID of the game */
  game?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The media of the external game. */
  gameReleaseFormat?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The name of the game according to the other service */
  name?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The platform of the external game product. */
  platform?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The other services ID for this game */
  uid?: string | null;

  @Column({ nullable: true, type: "text" })
  /** The website address (URL) of the item */
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The year in full (2018) */
  year?: number | null;
}

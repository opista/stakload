import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * A website url, usually associated with a game.
 */
@Entity("websites")
@Index(["game"])
@Index(["type"])
export class WebsiteEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The game this website is associated with */
  game?: number | null;

  @Column({ nullable: true, type: "boolean" })
  /** If this website is considered trusted */
  trusted?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  /** The service this website links to */
  type?: number | null;

  @Column({ type: "text" })
  /** The website address (URL) of the item */
  url!: string;
}

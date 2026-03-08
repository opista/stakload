import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * The hardware used to run the game or game delivery network.
 */
@Entity("platforms")
export class PlatformEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  /** An abbreviation of the platform name */
  abbreviation?: string | null;

  @Column({ nullable: true, type: "text" })
  /** An alternative name for the platform */
  alternativeName?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The generation of the platform */
  generation?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The family of platforms this one belongs to */
  platformFamily?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The logo of this platform */
  platformLogo?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The type of the platform */
  platformType?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The summary of the first Version of this platform */
  summary?: string | null;
}

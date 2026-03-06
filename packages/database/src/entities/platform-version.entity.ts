import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("platform_versions")
export class PlatformVersionEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  connectivity?: string | null;

  @Column({ nullable: true, type: "text" })
  cpu?: string | null;

  @Column({ nullable: true, type: "text" })
  graphics?: string | null;

  @Column({ nullable: true, type: "integer" })
  mainManufacturerId?: number | null;

  @Column({ nullable: true, type: "text" })
  media?: string | null;

  @Column({ nullable: true, type: "text" })
  memory?: string | null;

  @Column({ nullable: true, type: "text" })
  os?: string | null;

  @Column({ nullable: true, type: "text" })
  output?: string | null;

  @Column({ nullable: true, type: "integer" })
  platformId?: number | null;

  @Column({ nullable: true, type: "integer" })
  platformLogoId?: number | null;

  @Column({ nullable: true, type: "text" })
  resolutions?: string | null;

  @Column({ nullable: true, type: "text" })
  sound?: string | null;

  @Column({ nullable: true, type: "text" })
  storage?: string | null;

  @Column({ nullable: true, type: "text" })
  summary?: string | null;
}

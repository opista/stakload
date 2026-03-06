import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("game_engines")
export class GameEngineEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "simple-json" })
  companyIds?: number[] | null;

  @Column({ nullable: true, type: "text" })
  description?: string | null;

  @Column({ nullable: true, type: "integer" })
  logoId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  platformIds?: number[] | null;
}

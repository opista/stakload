import { Column, Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("release_date_statuses")
export class ReleaseDateStatusEntity extends NamedEntity {
  @Column({ nullable: true, type: "text" })
  description?: string | null;
}

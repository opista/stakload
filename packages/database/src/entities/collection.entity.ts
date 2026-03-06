import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("collections")
export class CollectionEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  description?: string | null;
}

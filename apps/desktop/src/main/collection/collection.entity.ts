import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import type { GameFilters } from "@stakload/contracts/database/games";

@Entity("collections")
export class CollectionEntity {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column("simple-json")
  filters!: GameFilters;

  @Column("text")
  name!: string;
}

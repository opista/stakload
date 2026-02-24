import type { GameFilters } from "@contracts/database/games";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("collections")
export class CollectionEntity {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column("simple-json")
  filters!: GameFilters;

  @Column({ nullable: true, type: "text" })
  icon?: string;

  @Column("text")
  name!: string;
}

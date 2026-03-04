import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("igdb_tombstones")
export class IgdbTombstoneEntity {
  @CreateDateColumn({ type: "timestamptz" })
  deletedAt!: Date;

  @PrimaryColumn({ type: "integer" })
  igdbId!: number;

  @PrimaryColumn({ type: "text" })
  resource!: string;
}

import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("websites")
@Index(["gameId"])
@Index(["typeId"])
export class WebsiteEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  gameId?: number | null;

  @Column({ nullable: true, type: "boolean" })
  trusted?: boolean | null;

  @Column({ nullable: true, type: "integer" })
  typeId?: number | null;

  @Column({ type: "text" })
  url!: string;
}

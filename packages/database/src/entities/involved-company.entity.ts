import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("involved_companies")
@Index(["companyId"])
@Index(["gameId"])
export class InvolvedCompanyEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "integer" })
  companyId!: number;

  @Column({ nullable: true, type: "boolean" })
  developer?: boolean | null;

  @Column({ type: "integer" })
  gameId!: number;

  @Column({ nullable: true, type: "boolean" })
  porting?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  publisher?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  supporting?: boolean | null;
}

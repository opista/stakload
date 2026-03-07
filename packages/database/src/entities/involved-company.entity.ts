import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Involved Company.
 */
@Entity("involved_companies")
@Index(["company"])
@Index(["game"])
export class InvolvedCompanyEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ type: "integer" })
  /** The company involved with the game */
  company!: number;

  @Column({ nullable: true, type: "boolean" })
  /** Indicates if the company is a developer */
  developer?: boolean | null;

  @Column({ type: "integer" })
  /** The game this company is involved in */
  game!: number;

  @Column({ nullable: true, type: "boolean" })
  /** Indicates if the company did porting work */
  porting?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  /** Indicates if the company is a publisher */
  publisher?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  /** Indicates if the company is in a supporting role */
  supporting?: boolean | null;
}

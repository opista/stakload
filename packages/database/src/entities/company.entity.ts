import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Video game companies. Both publishers & developers.
 */
@Entity("companies")
export class CompanyEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "integer" })
  /** The format of the change date */
  changeDateFormat?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The new ID for a company that has gone through a merger or restructuring */
  changedCompany?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** ISO 3166-1 country code */
  country?: number | null;

  @Column({ nullable: true, type: "text" })
  /** A free text description of a company */
  description?: string | null;

  @Column({ array: true, nullable: true, type: "int" })
  /** An array of games that a company has developed */
  developed?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  /** The company’s logo */
  logo?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** A company with a controlling interest in a specific company */
  parent?: number | null;

  @Column({ array: true, nullable: true, type: "int" })
  /** An array of games that a company has published */
  published?: number[] | null;

  @Column({ nullable: true, type: "timestamptz" })
  /** The date a company was founded */
  startDate?: Date | null;

  @Column({ nullable: true, type: "integer" })
  /** The format of the start date */
  startDateFormat?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The status of the company */
  status?: number | null;
}

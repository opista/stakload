import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Status definitions for companies.
 */
@Entity("company_statuses")
export class CompanyStatusEntity extends NamedEntity {}

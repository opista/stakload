import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Company Status.
 */
@Entity("company_statuses")
export class CompanyStatusEntity extends NamedEntity {}

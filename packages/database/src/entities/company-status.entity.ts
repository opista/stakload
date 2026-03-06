import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("company_statuses")
export class CompanyStatusEntity extends NamedEntity {}

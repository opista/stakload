import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("franchises")
export class FranchiseEntity extends SluggedNamedEntity {}

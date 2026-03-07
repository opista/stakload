import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Franchise.
 */
@Entity("franchises")
export class FranchiseEntity extends SluggedNamedEntity {}

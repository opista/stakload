import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Franchise groupings for related games.
 */
@Entity("franchises")
export class FranchiseEntity extends SluggedNamedEntity {}

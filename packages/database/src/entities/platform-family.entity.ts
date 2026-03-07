import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Platform Family.
 */
@Entity("platform_families")
export class PlatformFamilyEntity extends SluggedNamedEntity {}

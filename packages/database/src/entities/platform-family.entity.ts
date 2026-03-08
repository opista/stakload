import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Platform family definitions.
 */
@Entity("platform_families")
export class PlatformFamilyEntity extends SluggedNamedEntity {}

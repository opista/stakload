import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Platform type definitions.
 */
@Entity("platform_types")
export class PlatformTypeEntity extends NamedEntity {}

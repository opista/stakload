import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Platform Type.
 */
@Entity("platform_types")
export class PlatformTypeEntity extends NamedEntity {}

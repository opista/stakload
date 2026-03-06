import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("platform_types")
export class PlatformTypeEntity extends NamedEntity {}

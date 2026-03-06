import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("platform_families")
export class PlatformFamilyEntity extends SluggedNamedEntity {}

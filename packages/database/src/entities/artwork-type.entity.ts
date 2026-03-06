import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("artwork_types")
export class ArtworkTypeEntity extends SluggedNamedEntity {}

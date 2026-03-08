import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Artwork type definitions used by game artwork records.
 */
@Entity("artwork_types")
export class ArtworkTypeEntity extends SluggedNamedEntity {}

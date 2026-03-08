import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Artwork Type.
 */
@Entity("artwork_types")
export class ArtworkTypeEntity extends SluggedNamedEntity {}

import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Genre.
 */
@Entity("genres")
export class GenreEntity extends SluggedNamedEntity {}

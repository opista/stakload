import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Genre definitions used to classify games.
 */
@Entity("genres")
export class GenreEntity extends SluggedNamedEntity {}

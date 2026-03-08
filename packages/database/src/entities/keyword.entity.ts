import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Keyword definitions used to tag games.
 */
@Entity("keywords")
export class KeywordEntity extends SluggedNamedEntity {}

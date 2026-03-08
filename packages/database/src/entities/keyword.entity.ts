import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Keyword.
 */
@Entity("keywords")
export class KeywordEntity extends SluggedNamedEntity {}

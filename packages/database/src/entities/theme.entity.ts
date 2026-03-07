import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Theme.
 */
@Entity("themes")
export class ThemeEntity extends SluggedNamedEntity {}

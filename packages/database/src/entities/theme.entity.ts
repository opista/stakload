import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Theme definitions used to classify games.
 */
@Entity("themes")
export class ThemeEntity extends SluggedNamedEntity {}

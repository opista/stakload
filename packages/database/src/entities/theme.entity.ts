import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("themes")
export class ThemeEntity extends SluggedNamedEntity {}

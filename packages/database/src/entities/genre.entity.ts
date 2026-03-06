import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("genres")
export class GenreEntity extends SluggedNamedEntity {}

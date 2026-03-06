import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("keywords")
export class KeywordEntity extends SluggedNamedEntity {}

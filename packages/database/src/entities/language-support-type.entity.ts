import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("language_support_types")
export class LanguageSupportTypeEntity extends NamedEntity {}

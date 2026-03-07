import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Language Support Type.
 */
@Entity("language_support_types")
export class LanguageSupportTypeEntity extends NamedEntity {}

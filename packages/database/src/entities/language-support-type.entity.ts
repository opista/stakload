import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Language support type definitions.
 */
@Entity("language_support_types")
export class LanguageSupportTypeEntity extends NamedEntity {}

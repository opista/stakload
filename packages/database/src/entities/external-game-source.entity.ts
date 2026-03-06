import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Source definitions for external game identifiers.
 */
@Entity("external_game_sources")
export class ExternalGameSourceEntity extends NamedEntity {}

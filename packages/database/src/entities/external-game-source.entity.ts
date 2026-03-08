import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * External Game Source.
 */
@Entity("external_game_sources")
export class ExternalGameSourceEntity extends NamedEntity {}

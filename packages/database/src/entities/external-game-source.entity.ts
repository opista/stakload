import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("external_game_sources")
export class ExternalGameSourceEntity extends NamedEntity {}

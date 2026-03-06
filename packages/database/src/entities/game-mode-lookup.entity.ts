import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("game_modes_lookup")
export class GameModeLookupEntity extends SluggedNamedEntity {}

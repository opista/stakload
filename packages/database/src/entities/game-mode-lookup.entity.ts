import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Game mode definitions such as single-player or multiplayer.
 */
@Entity("game_modes_lookup")
export class GameModeLookupEntity extends SluggedNamedEntity {}

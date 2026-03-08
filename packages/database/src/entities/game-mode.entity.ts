import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Game mode definitions such as single-player or multiplayer.
 */
@Entity("game_modes")
export class GameModeEntity extends SluggedNamedEntity {}

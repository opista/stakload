import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Game Mode.
 */
@Entity("game_modes")
export class GameModeEntity extends SluggedNamedEntity {}

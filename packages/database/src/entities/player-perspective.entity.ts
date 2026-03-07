import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Player Perspective.
 */
@Entity("player_perspectives")
export class PlayerPerspectiveEntity extends SluggedNamedEntity {}

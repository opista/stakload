import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Player perspective definitions used by games.
 */
@Entity("player_perspectives")
export class PlayerPerspectiveEntity extends SluggedNamedEntity {}

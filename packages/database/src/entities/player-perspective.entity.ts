import { Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

@Entity("player_perspectives")
export class PlayerPerspectiveEntity extends SluggedNamedEntity {}

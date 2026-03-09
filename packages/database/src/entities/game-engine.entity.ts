import { Column, Entity } from "typeorm";

import { SluggedNamedEntity } from "./base.entity";

/**
 * Game Engine.
 */
@Entity("game_engines")
export class GameEngineEntity extends SluggedNamedEntity {
  @Column({ array: true, nullable: true, type: "int" })
  /** Companies who used this game engine */
  companies?: number[] | null;

  @Column({ nullable: true, type: "text" })
  /** Description of the game engine */
  description?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** Logo of the game engine */
  logo?: number | null;

  @Column({ array: true, nullable: true, type: "int" })
  /** Platforms this game engine was deployed on */
  platforms?: number[] | null;
}

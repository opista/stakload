import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to themes.
 */
@Entity("game_themes")
@Index(["theme"])
export class GameThemeLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  theme!: number;
}

import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to themes.
 */
@Entity("game_themes")
@Index(["themeId"])
export class GameThemeEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  themeId!: number;
}

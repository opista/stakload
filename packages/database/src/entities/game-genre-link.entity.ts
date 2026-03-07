import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to genres.
 */
@Entity("game_genres")
@Index(["genre"])
export class GameGenreLinkEntity {
  @PrimaryColumn({ type: "integer" })
  game!: number;

  @PrimaryColumn({ type: "integer" })
  genre!: number;
}

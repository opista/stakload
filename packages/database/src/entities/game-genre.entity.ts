import { Entity, Index, PrimaryColumn } from "typeorm";

/**
 * Join table linking games to genres.
 */
@Entity("game_genres")
@Index(["genreId"])
export class GameGenreEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  genreId!: number;
}

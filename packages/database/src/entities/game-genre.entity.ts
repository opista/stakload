import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_genres")
@Index(["genreId"])
export class GameGenreEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  genreId!: number;
}

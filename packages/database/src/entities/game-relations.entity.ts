import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity("game_collections")
@Index(["collectionId"])
export class GameCollectionEntity {
  @PrimaryColumn({ type: "integer" })
  collectionId!: number;

  @PrimaryColumn({ type: "integer" })
  gameId!: number;
}

@Entity("game_franchises")
@Index(["franchiseId"])
export class GameFranchiseEntity {
  @PrimaryColumn({ type: "integer" })
  franchiseId!: number;

  @PrimaryColumn({ type: "integer" })
  gameId!: number;
}

@Entity("game_genres")
@Index(["genreId"])
export class GameGenreEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  genreId!: number;
}

@Entity("game_keywords")
@Index(["keywordId"])
export class GameKeywordEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  keywordId!: number;
}

@Entity("game_modes")
@Index(["modeId"])
export class GameModeEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  modeId!: number;
}

@Entity("game_platforms")
@Index(["platformId"])
export class GamePlatformEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  platformId!: number;
}

@Entity("game_player_perspectives")
@Index(["playerPerspectiveId"])
export class GamePlayerPerspectiveEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  playerPerspectiveId!: number;
}

@Entity("game_themes")
@Index(["themeId"])
export class GameThemeEntity {
  @PrimaryColumn({ type: "integer" })
  gameId!: number;

  @PrimaryColumn({ type: "integer" })
  themeId!: number;
}

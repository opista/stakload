import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Video Games!.
 */
@Entity("games")
export class GameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "simple-json" })
  /** The PEGI rating */
  ageRatings?: number[] | null;

  @Column({ nullable: true, type: "double precision" })
  /** Rating based on external critic scores */
  aggregatedRating?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Number of external critic scores */
  aggregatedRatingCount?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Alternative names for this game */
  alternativeNames?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Artworks of this game */
  artworks?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  /** The bundles this game is a part of */
  bundles?: number[] | null;

  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** The cover of this game */
  cover?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** External IDs this game has on other services */
  externalGames?: number[] | null;

  @Column({ nullable: true, type: "timestamptz" })
  /** The first release date for this game */
  firstReleaseDate?: Date | null;

  @Column({ nullable: true, type: "integer" })
  /** The main franchise */
  franchise?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** The game engine used in this game */
  gameEngines?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  /** The status of the games release */
  gameStatus?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The category of this game */
  gameType?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Supported Languages for this game */
  languageSupports?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Multiplayer modes for this game */
  multiplayerModes?: number[] | null;

  @Column({ nullable: true, type: "text" })
  /** Name of the game */
  name?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** If a DLC, expansion or part of a bundle, this is the main game or bundle */
  parentGame?: number | null;

  @Column({ nullable: true, type: "double precision" })
  /** Average IGDB user rating */
  rating?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Total number of IGDB user ratings */
  ratingCount?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Similar games */
  similarGames?: number[] | null;

  @Column({ nullable: true, type: "text" })
  /** A url-safe, unique, lower-case version of the name */
  slug?: string | null;

  @Column({ nullable: true, type: "text" })
  /** A short description of a games story */
  storyline?: string | null;

  @Column({ nullable: true, type: "text" })
  /** A description of the game */
  summary?: string | null;

  @Column({ nullable: true, type: "double precision" })
  /** Average rating based on both IGDB user and external critic scores */
  totalRating?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Total number of user and external critic scores */
  totalRatingCount?: number | null;

  @Column({ nullable: true, type: "text" })
  /** The website address (URL) of the item */
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** If a version, this is the main game */
  versionParent?: number | null;

  @Column({ nullable: true, type: "text" })
  /** Title of this version (i.e Gold edition) */
  versionTitle?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  /** Videos of this game */
  videos?: number[] | null;
}

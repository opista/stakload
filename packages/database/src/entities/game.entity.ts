import { Column, Entity } from "typeorm";

import { IgdbEntity } from "./base.entity";

@Entity("games")
export class GameEntity extends IgdbEntity {
  @Column({ nullable: true, type: "simple-json" })
  ageRatingIds?: number[] | null;

  @Column({ nullable: true, type: "double precision" })
  aggregatedRating?: number | null;

  @Column({ nullable: true, type: "integer" })
  aggregatedRatingCount?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  alternativeNameIds?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  artworkIds?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  bundleIds?: number[] | null;

  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  coverId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  externalGameIds?: number[] | null;

  @Column({ nullable: true, type: "timestamptz" })
  firstReleaseDate?: Date | null;

  @Column({ nullable: true, type: "integer" })
  franchiseId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  gameEngineIds?: number[] | null;

  @Column({ nullable: true, type: "integer" })
  gameStatusId?: number | null;

  @Column({ nullable: true, type: "integer" })
  gameTypeId?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  languageSupportIds?: number[] | null;

  @Column({ nullable: true, type: "simple-json" })
  multiplayerModeIds?: number[] | null;

  @Column({ nullable: true, type: "text" })
  name?: string | null;

  @Column({ nullable: true, type: "integer" })
  parentGameId?: number | null;

  @Column({ nullable: true, type: "double precision" })
  rating?: number | null;

  @Column({ nullable: true, type: "integer" })
  ratingCount?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  similarGameIds?: number[] | null;

  @Column({ nullable: true, type: "text" })
  slug?: string | null;

  @Column({ nullable: true, type: "text" })
  storyline?: string | null;

  @Column({ nullable: true, type: "text" })
  summary?: string | null;

  @Column({ nullable: true, type: "double precision" })
  totalRating?: number | null;

  @Column({ nullable: true, type: "integer" })
  totalRatingCount?: number | null;

  @Column({ nullable: true, type: "text" })
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  versionParentId?: number | null;

  @Column({ nullable: true, type: "text" })
  versionTitle?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  videoIds?: number[] | null;
}

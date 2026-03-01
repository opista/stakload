import type {
  AgeRating,
  GameInstallationDetails,
  IdAndName,
  Library,
  LibraryMeta,
  Media,
  MultiplayerMode,
  Website,
} from "@stakload/contracts/database/games";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("games")
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  _id!: string;

  @Column({ nullable: true, type: "simple-json" })
  ageRatings?: AgeRating[];

  @Column({ nullable: true, type: "datetime" })
  archivedAt?: Date;

  @Column({ nullable: true, type: "simple-json" })
  artworks?: Media[];

  @Column({ nullable: true, type: "text" })
  cover?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true, type: "text" })
  description?: string;

  @Column({ nullable: true, type: "simple-json" })
  developers?: IdAndName[];

  @Column({ nullable: true, type: "text" })
  firstReleaseDate?: string;

  @Column({ nullable: true, type: "text" })
  gameId?: string;

  @Column({ nullable: true, type: "simple-json" })
  gameModes?: IdAndName[];

  @Column({ nullable: true, type: "simple-json" })
  genres?: IdAndName[];

  @Column({ nullable: true, type: "integer" })
  igdbId?: number;

  @Column({ nullable: true, type: "simple-json" })
  installationDetails?: GameInstallationDetails;

  @Column({ default: false, type: "boolean" })
  isFavourite!: boolean;

  @Column({ default: false, type: "boolean" })
  isInstalled!: boolean;

  @Column({ default: false, type: "boolean" })
  isQuickLaunch!: boolean;

  @Column({ nullable: true, type: "datetime" })
  lastPlayedAt?: Date;

  @Column("text")
  library!: Library;

  @Column({ nullable: true, type: "simple-json" })
  libraryMeta?: LibraryMeta;

  @Column({ nullable: true, type: "datetime" })
  metadataSyncedAt?: Date;

  @Column({ nullable: true, type: "simple-json" })
  multiplayerModes?: MultiplayerMode[];

  @Column("text")
  name!: string;

  @Column({ nullable: true, type: "simple-json" })
  platforms?: IdAndName[];

  @Column({ nullable: true, type: "simple-json" })
  playerPerspectives?: IdAndName[];

  @Column({ nullable: true, type: "simple-json" })
  publishers?: IdAndName[];

  @Column({ nullable: true, type: "simple-json" })
  screenshots?: string[];

  @Column({ nullable: true, type: "text" })
  sortableName?: string;

  @Column({ nullable: true, type: "text" })
  storyline?: string;

  @Column({ nullable: true, type: "text" })
  summary?: string;

  @Column({ nullable: true, type: "simple-json" })
  videos?: string[];

  @Column({ nullable: true, type: "simple-json" })
  websites?: Website[];
}

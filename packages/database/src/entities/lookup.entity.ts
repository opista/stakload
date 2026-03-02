import { Column, Entity } from "typeorm";

import { IgdbEntity, SluggedNamedEntity } from "./base.entity";

@Entity("collections")
export class CollectionEntity extends SluggedNamedEntity {
  @Column({ nullable: true, type: "text" })
  description?: string | null;
}

@Entity("franchises")
export class FranchiseEntity extends SluggedNamedEntity {}

@Entity("game_modes_lookup")
export class GameModeLookupEntity extends SluggedNamedEntity {}

@Entity("genres")
export class GenreEntity extends SluggedNamedEntity {}

@Entity("keywords")
export class KeywordEntity extends SluggedNamedEntity {}

@Entity("player_perspectives")
export class PlayerPerspectiveEntity extends SluggedNamedEntity {}

@Entity("themes")
export class ThemeEntity extends SluggedNamedEntity {}

@Entity("website_types")
export class WebsiteTypeEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  type!: string;
}

import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export abstract class TimestampedEntity {
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

export abstract class IgdbEntity extends TimestampedEntity {
  @PrimaryColumn({ type: "integer" })
  igdbId!: number;
}

export abstract class ImageAssetEntity extends IgdbEntity {
  @Column({ nullable: true, type: "boolean" })
  alphaChannel?: boolean | null;

  @Column({ nullable: true, type: "boolean" })
  animated?: boolean | null;

  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  height?: number | null;

  @Column({ nullable: true, type: "text" })
  imageId?: string | null;

  @Column({ nullable: true, type: "text" })
  url?: string | null;

  @Column({ nullable: true, type: "integer" })
  width?: number | null;
}

export abstract class NamedEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  checksum?: string | null;

  @Column({ type: "text" })
  name!: string;
}

export abstract class SluggedNamedEntity extends NamedEntity {
  @Column({ nullable: true, type: "text" })
  slug?: string | null;

  @Column({ nullable: true, type: "text" })
  url?: string | null;
}

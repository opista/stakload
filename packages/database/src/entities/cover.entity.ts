import { Column, Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

@Entity("covers")
export class CoverEntity extends ImageAssetEntity {
  @Column({ type: "integer" })
  gameId!: number;
}

import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

@Entity("platform_logos")
export class PlatformLogoEntity extends ImageAssetEntity {}

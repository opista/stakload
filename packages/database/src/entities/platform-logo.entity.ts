import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Logo media assets for platforms.
 */
@Entity("platform_logos")
export class PlatformLogoEntity extends ImageAssetEntity {}

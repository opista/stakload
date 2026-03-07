import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Platform Logo.
 */
@Entity("platform_logos")
export class PlatformLogoEntity extends ImageAssetEntity {}

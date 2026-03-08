import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Company Logo.
 */
@Entity("company_logos")
export class CompanyLogoEntity extends ImageAssetEntity {}

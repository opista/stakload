import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

/**
 * Logo media assets for companies.
 */
@Entity("company_logos")
export class CompanyLogoEntity extends ImageAssetEntity {}

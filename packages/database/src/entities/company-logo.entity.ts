import { Entity } from "typeorm";

import { ImageAssetEntity } from "./base.entity";

@Entity("company_logos")
export class CompanyLogoEntity extends ImageAssetEntity {}

import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

@Entity("age_rating_organizations")
export class AgeRatingOrganizationEntity extends NamedEntity {}

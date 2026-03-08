import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Age Rating Organization.
 */
@Entity("age_rating_organizations")
export class AgeRatingOrganizationEntity extends NamedEntity {}

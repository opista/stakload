import { Entity } from "typeorm";

import { NamedEntity } from "./base.entity";

/**
 * Organisations that publish age rating systems.
 */
@Entity("age_rating_organizations")
export class AgeRatingOrganizationEntity extends NamedEntity {}

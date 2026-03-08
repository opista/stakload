import { Column, Entity, Index } from "typeorm";

import { IgdbEntity } from "./base.entity";

/**
 * Game Time To Beat.
 */
@Entity("game_time_to_beats")
@Index(["gameId"])
export class GameTimeToBeatEntity extends IgdbEntity {
  @Column({ nullable: true, type: "text" })
  /** Hash of the object */
  checksum?: string | null;

  @Column({ nullable: true, type: "integer" })
  /** Average time (in seconds) to finish the game to 100% completion. */
  completely?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Total number of time to beat submissions for this game */
  count?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** The ID of the game associated with the time to beat data */
  gameId?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Average time (in seconds) to finish the game to its credits without spending notable time on extras such as side quests. */
  hastily?: number | null;

  @Column({ nullable: true, type: "integer" })
  /** Average time (in seconds) to finish the game while mixing in some extras such as side quests without being overly thorough. */
  normally?: number | null;
}

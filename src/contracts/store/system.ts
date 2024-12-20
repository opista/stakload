import { Platform } from "@contracts/database/games";

export type SystemState = {
  navigationPaneWidth: number;
  operatingSystem: Platform | null;
};

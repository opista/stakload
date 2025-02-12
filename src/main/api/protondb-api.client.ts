import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

@Service()
export class ProtondbApiClient {
  constructor(private readonly logger: LoggerService) {}

  async getTier(gameId: string) {
    try {
      const response = await fetch(`https://www.protondb.com/api/v1/reports/summaries/${gameId}.json`);
      const parsed = await response.json();
      return parsed.tier;
    } catch (err) {
      this.logger.error("Failed to get Protondb tier", err);
      return null;
    }
  }
}

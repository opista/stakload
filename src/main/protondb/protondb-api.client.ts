import { ConsoleLogger, Injectable } from "@nestjs/common";

@Injectable()
export class ProtondbApiClient {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }

  async getTier(gameId: string) {
    try {
      const response = await fetch(`https://www.protondb.com/api/v1/reports/summaries/${gameId}.json`);
      const parsed = await response.json();
      return (parsed as { tier: string }).tier;
    } catch (err) {
      this.logger.error("Failed to get Protondb tier", err);
      return null;
    }
  }
}

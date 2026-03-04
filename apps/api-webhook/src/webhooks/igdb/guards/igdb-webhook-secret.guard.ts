import { createHash, timingSafeEqual } from "node:crypto";

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { AppConfigService } from "../../../config/app-config.service";

@Injectable()
export class IgdbWebhookSecretGuard implements CanActivate {
  constructor(private readonly configService: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const expectedSecret = this.configService.igdbWebhookSecret;
    const providedSecret = request.headers["x-secret"];

    if (!expectedSecret || !providedSecret || this.secretsMatch(expectedSecret, providedSecret) === false) {
      throw new UnauthorizedException("Invalid IGDB webhook secret");
    }

    return true;
  }

  private secretsMatch(expected: string, actual: string): boolean {
    const expectedDigest = createHash("sha256").update(expected).digest();
    const actualDigest = createHash("sha256").update(actual).digest();

    return timingSafeEqual(expectedDigest, actualDigest);
  }
}

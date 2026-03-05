import type { ExecutionContext } from "@nestjs/common";
import { Mocked, TestBed } from "@suites/unit";

import { AppConfigService } from "../../config/app-config.service";
import { IgdbWebhookSecretGuard } from "./igdb-webhook-secret.guard";

const createContext = (secret?: string): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          "x-secret": secret,
        },
      }),
    }),
  }) as ExecutionContext;

describe("IgdbWebhookSecretGuard", () => {
  let configService: Mocked<AppConfigService>;
  let guard: IgdbWebhookSecretGuard;

  const setWebhookSecret = (value: string): void => {
    Object.defineProperty(configService, "igdbWebhookSecret", {
      configurable: true,
      get: () => value,
    });
  };

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbWebhookSecretGuard).compile();

    guard = unit;
    configService = unitRef.get(AppConfigService);
  });

  it("should accept a matching secret", () => {
    setWebhookSecret("expected-secret");

    expect(guard.canActivate(createContext("expected-secret"))).toBe(true);
  });

  it("should reject a missing or invalid secret", () => {
    setWebhookSecret("expected-secret");

    expect(() => guard.canActivate(createContext("wrong-secret"))).toThrow();
    expect(() => guard.canActivate(createContext())).toThrow();
  });
});

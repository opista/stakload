import { Mocked, TestBed } from "@suites/unit";
import type { MockedFunction } from "vitest";

import { AppConfigService } from "../config/app-config.service";
import { RateLimiterService } from "../rate-limiter/rate-limiter.service";
import { IgdbApiClient } from "./igdb-api.client";
import { IgdbTokenService } from "./igdb-token.service";
import { IgdbApiError } from "./types/igdb-api.types";

describe("IgdbApiClient", () => {
  let configService: Mocked<AppConfigService>;
  let fetchMock: MockedFunction<typeof fetch>;
  let rateLimiter: Mocked<RateLimiterService>;
  let tokenService: Mocked<IgdbTokenService>;
  let client: IgdbApiClient;

  beforeEach(async () => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { unit, unitRef } = await TestBed.solitary(IgdbApiClient).compile();

    client = unit;
    configService = unitRef.get(AppConfigService);
    rateLimiter = unitRef.get(RateLimiterService);
    tokenService = unitRef.get(IgdbTokenService);

    Object.defineProperty(configService, "igdbClientId", { configurable: true, get: () => "client-id" });

    rateLimiter.schedule.mockImplementation((fn) => fn());
    tokenService.getToken.mockResolvedValue("access-token-1");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should make a request with the correct headers", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue("[]"),
    } as never);

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).resolves.toEqual([]);

    expect(fetchMock).toHaveBeenCalledWith("https://api.igdb.com/v4/webhooks/", {
      headers: {
        Authorization: "Bearer access-token-1",
        "Client-ID": "client-id",
      },
      method: "GET",
    });
  });

  it("should retry once on an unauthorized response", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: "Unauthorized" })),
      } as never)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("[]"),
      } as never);

    tokenService.getToken.mockResolvedValueOnce("access-token-1").mockResolvedValueOnce("access-token-2");

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).resolves.toEqual([]);

    expect(tokenService.invalidate).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://api.igdb.com/v4/webhooks/",
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer access-token-2" }) }),
    );
  });

  it("should not retry a second unauthorized response", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      text: vi.fn().mockResolvedValue(JSON.stringify({ message: "Unauthorized" })),
    } as never);

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).rejects.toBeInstanceOf(
      IgdbApiError,
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should throw a structured error on non-2xx responses", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      text: vi.fn().mockResolvedValue(JSON.stringify({ message: "Already exists" })),
    } as never);

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).rejects.toEqual(
      new IgdbApiError("Already exists", 409, { message: "Already exists" }),
    );
  });
});

import { Mocked, TestBed } from "@suites/unit";
import type { MockedFunction } from "vitest";

import { AppConfigService } from "../config/app-config.service";
import { IgdbTokenService } from "./igdb-token.service";

describe("IgdbTokenService", () => {
  let configService: Mocked<AppConfigService>;
  let fetchMock: MockedFunction<typeof fetch>;
  let service: IgdbTokenService;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T12:00:00.000Z"));
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { unit, unitRef } = await TestBed.solitary(IgdbTokenService).compile();

    service = unit;
    configService = unitRef.get(AppConfigService);

    Object.defineProperties(configService, {
      igdbClientId: { configurable: true, get: () => "client-id" },
      igdbClientSecret: { configurable: true, get: () => "client-secret" },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("should fetch and cache a token", async () => {
    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ access_token: "token-1", expires_in: 120, token_type: "bearer" }),
      ok: true,
      status: 200,
    } as never);

    const first = await service.getToken();
    const second = await service.getToken();

    expect(first).toBe("token-1");
    expect(second).toBe("token-1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should coalesce concurrent token refreshes into a single fetch", async () => {
    let resolveAuthFetch: ((value: Response) => void) | undefined;
    fetchMock.mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveAuthFetch = resolve;
        }),
    );

    const first = service.getToken();
    const second = service.getToken();

    resolveAuthFetch?.({
      json: vi.fn().mockResolvedValue({ access_token: "token-1", expires_in: 120, token_type: "bearer" }),
      ok: true,
      status: 200,
    } as never);

    await expect(first).resolves.toBe("token-1");
    await expect(second).resolves.toBe("token-1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should re-fetch a token after it expires", async () => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ access_token: "token-1", expires_in: 61, token_type: "bearer" }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ access_token: "token-2", expires_in: 120, token_type: "bearer" }),
        ok: true,
        status: 200,
      } as never);

    await service.getToken();

    // expires_in: 61s, buffer: 60s → valid window is only 1s; advance past it
    vi.advanceTimersByTime(2_000);

    const token = await service.getToken();

    expect(token).toBe("token-2");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should throw when the token endpoint returns an error", async () => {
    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue({ error: "invalid_client" }),
      ok: false,
      status: 401,
    } as never);

    await expect(service.getToken()).rejects.toThrow("Failed to refresh IGDB access token: 401");
  });

  it("should allow a fresh fetch after invalidation", async () => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ access_token: "token-1", expires_in: 120, token_type: "bearer" }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ access_token: "token-2", expires_in: 120, token_type: "bearer" }),
        ok: true,
        status: 200,
      } as never);

    await service.getToken();
    service.invalidate();
    const token = await service.getToken();

    expect(token).toBe("token-2");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

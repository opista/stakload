import { Mocked, TestBed } from "@suites/unit";
import type { MockedFunction } from "vitest";

import { AppConfigService } from "../config/app-config.service";
import { IgdbApiClient } from "./igdb-api.client";
import { IgdbApiError } from "./types/igdb-api.types";

describe("IgdbApiClient", () => {
  let configService: Mocked<AppConfigService>;
  let fetchMock: MockedFunction<typeof fetch>;
  let client: IgdbApiClient;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-04T12:00:00.000Z"));
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { unit, unitRef } = await TestBed.solitary(IgdbApiClient).compile();

    client = unit;
    configService = unitRef.get(AppConfigService);

    Object.defineProperties(configService, {
      igdbClientId: {
        configurable: true,
        get: () => "client-id",
      },
      igdbClientSecret: {
        configurable: true,
        get: () => "client-secret",
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("should fetch and cache an access token", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({
        access_token: "access-token-1",
        expires_in: 120,
        token_type: "bearer",
      }),
      ok: true,
      status: 200,
    } as never);
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue("[]"),
    } as never);

    await client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");
    await client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");

    expect(fetchMock).toHaveBeenNthCalledWith(2, "https://api.igdb.com/v4/webhooks/", {
      headers: {
        Authorization: "Bearer access-token-1",
        "Client-ID": "client-id",
      },
      method: "GET",
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("should coalesce concurrent token refreshes", async () => {
    let resolveAuthFetch: ((value: Response) => void) | undefined;
    fetchMock
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveAuthFetch = resolve;
          }),
      )
      .mockResolvedValue({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("[]"),
      } as never);

    const first = client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");
    const second = client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");

    resolveAuthFetch?.({
      json: vi.fn().mockResolvedValue({
        access_token: "access-token-1",
        expires_in: 120,
        token_type: "bearer",
      }),
      ok: true,
      status: 200,
    } as never);

    await expect(first).resolves.toEqual([]);
    await expect(second).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("should retry once on an unauthorized response", async () => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "access-token-1",
          expires_in: 120,
          token_type: "bearer",
        }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: "Unauthorized" })),
      } as never)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "access-token-2",
          expires_in: 120,
          token_type: "bearer",
        }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("[]"),
      } as never);

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("should throw a structured error on non-2xx responses", async () => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "access-token-1",
          expires_in: 120,
          token_type: "bearer",
        }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: "Already exists" })),
      } as never);

    await expect(client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks")).rejects.toEqual(
      new IgdbApiError("Already exists", 409, { message: "Already exists" }),
    );
  });

  it("should refresh token after expiry", async () => {
    fetchMock
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "access-token-1",
          expires_in: 61,
          token_type: "bearer",
        }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("[]"),
      } as never)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          access_token: "access-token-2",
          expires_in: 120,
          token_type: "bearer",
        }),
        ok: true,
        status: 200,
      } as never)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue("[]"),
      } as never);

    await client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");
    vi.advanceTimersByTime(2_000);
    await client.requestJson("/webhooks/", { method: "GET" }, "listWebhooks");

    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});

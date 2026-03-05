import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { Mocked, TestBed } from "@suites/unit";
import { lastValueFrom, of } from "rxjs";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";
import { IgdbTombstoneInterceptor } from "./igdb-tombstone.interceptor";

const createContext = (resource: string, action: string, id?: number): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        body: { id },
        params: { action, resource },
      }),
      getResponse: () => ({
        send: vi.fn(),
        status: vi.fn().mockReturnThis(),
      }),
    }),
  }) as ExecutionContext;

describe("IgdbTombstoneInterceptor", () => {
  let interceptor: IgdbTombstoneInterceptor;
  let service: Mocked<IgdbTombstoneService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbTombstoneInterceptor).compile();

    interceptor = unit;
    service = unitRef.get(IgdbTombstoneService);
  });

  it("should short-circuit create and update requests for tombstoned records", async () => {
    void service.isTombstoned.mockResolvedValue(true);
    const handler: CallHandler = {
      handle: () => of("next"),
    };

    const result = await lastValueFrom(interceptor.intercept(createContext("games", "update", 10), handler), {
      defaultValue: undefined,
    });

    expect(result).toBeUndefined();
    expect(service.isTombstoned).toHaveBeenCalledWith("games", 10);
  });

  it("should pass through delete requests without tombstone lookup", async () => {
    const handler: CallHandler = {
      handle: () => of("next"),
    };

    const result = await lastValueFrom(interceptor.intercept(createContext("games", "delete", 10), handler));

    expect(result).toBe("next");
    expect(service.isTombstoned).not.toHaveBeenCalled();
  });

  it("should reject non-delete requests without an integer id", () => {
    const handler: CallHandler = {
      handle: () => of("next"),
    };

    expect(() => interceptor.intercept(createContext("games", "create"), handler)).toThrow();
    expect(service.isTombstoned).not.toHaveBeenCalled();
  });

  it("should reject non-delete requests without a resource route param", () => {
    const handler: CallHandler = {
      handle: () => of("next"),
    };

    expect(() => interceptor.intercept(createContext("", "create", 10), handler)).toThrow();
    expect(service.isTombstoned).not.toHaveBeenCalled();
  });
});

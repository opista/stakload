import { RateLimiterService } from "./rate-limiter.service";

const MIN_TIME = 250;

describe("RateLimiterService", () => {
  let service: RateLimiterService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new RateLimiterService({ maxConcurrent: 8, minTime: MIN_TIME });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should rate limit to four requests per second", async () => {
    const fn = vi.fn().mockResolvedValue("result");

    const first = service.schedule(fn);
    const second = service.schedule(fn);

    await expect(first).resolves.toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(MIN_TIME);
    await expect(second).resolves.toBe("result");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should cap concurrent in-flight requests at eight", async () => {
    const igdbResolvers: Array<(value: Response) => void> = [];

    const fn = vi.fn().mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          igdbResolvers.push(resolve);
        }),
    );

    const requests = Array.from({ length: 9 }, () => service.schedule(fn));

    for (let i = 0; i < 8; i += 1) {
      await vi.advanceTimersByTimeAsync(MIN_TIME);
    }

    expect(fn).toHaveBeenCalledTimes(8);
    expect(igdbResolvers).toHaveLength(8);

    igdbResolvers.at(0)?.({} as Response);
    await Promise.resolve();
    await Promise.resolve();

    await vi.advanceTimersByTimeAsync(MIN_TIME);

    expect(fn).toHaveBeenCalledTimes(9);
    expect(igdbResolvers).toHaveLength(9);

    for (const resolve of igdbResolvers.slice(1)) {
      resolve({} as Response);
    }

    await Promise.all(requests);
  });
});

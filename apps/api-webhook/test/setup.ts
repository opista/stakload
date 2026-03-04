import "reflect-metadata";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
  vi.clearAllMocks();
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

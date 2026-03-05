import { BadRequestException } from "@nestjs/common";

import type { PinoLogger } from "@stakload/nestjs-logging";

import { ParseIgdbWebhookActionPipe } from "./parse-igdb-webhook-action.pipe";

describe("ParseIgdbWebhookActionPipe", () => {
  let pipe: ParseIgdbWebhookActionPipe;

  beforeEach(() => {
    pipe = new ParseIgdbWebhookActionPipe({
      setContext: vi.fn(),
      warn: vi.fn(),
    } as unknown as PinoLogger);
  });

  it("should accept supported webhook actions", () => {
    expect(pipe.transform("create")).toBe("create");
    expect(pipe.transform("update")).toBe("update");
    expect(pipe.transform("delete")).toBe("delete");
  });

  it("should reject unsupported webhook actions", () => {
    expect(() => pipe.transform("archive")).toThrow(BadRequestException);
  });
});

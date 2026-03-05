import { BadRequestException } from "@nestjs/common";

import type { PinoLogger } from "@stakload/nestjs-logging";

import { ParseIgdbWebhookResourcePipe } from "./parse-igdb-webhook-resource.pipe";

describe("ParseIgdbWebhookResourcePipe", () => {
  let pipe: ParseIgdbWebhookResourcePipe;

  beforeEach(() => {
    pipe = new ParseIgdbWebhookResourcePipe({
      setContext: vi.fn(),
      warn: vi.fn(),
    } as unknown as PinoLogger);
  });

  it("should accept known IGDB resources", () => {
    expect(pipe.transform("games")).toBe("games");
    expect(pipe.transform("platforms")).toBe("platforms");
  });

  it("should reject unknown IGDB resources", () => {
    expect(() => pipe.transform("not_a_real_resource")).toThrow(BadRequestException);
  });
});

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { IgdbApiError } from "../../igdb-api/types/igdb-api.types";
import { mapIgdbApiError } from "./map-igdb-api-error";

describe("mapIgdbApiError", () => {
  it("should map IGDB status codes to matching Nest exceptions", () => {
    expect(mapIgdbApiError(new IgdbApiError("bad", 400, {}))).toBeInstanceOf(BadRequestException);
    expect(mapIgdbApiError(new IgdbApiError("not found", 404, {}))).toBeInstanceOf(NotFoundException);
    expect(mapIgdbApiError(new IgdbApiError("conflict", 409, {}))).toBeInstanceOf(ConflictException);
    expect(mapIgdbApiError(new IgdbApiError("upstream", 500, {}))).toBeInstanceOf(InternalServerErrorException);
  });

  it("should pass through normal errors and wrap unknown values", () => {
    const normalError = new Error("boom");

    expect(mapIgdbApiError(normalError)).toBe(normalError);
    expect(mapIgdbApiError("boom")).toBeInstanceOf(InternalServerErrorException);
  });
});

import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { IgdbApiError } from "../../igdb-api/types/igdb-api.types";

export const mapIgdbApiError = (error: unknown): Error => {
  if (error instanceof IgdbApiError) {
    switch (error.statusCode) {
      case 400:
        return new BadRequestException(error.message);
      case 404:
        return new NotFoundException(error.message);
      case 409:
        return new ConflictException(error.message);
      default:
        return new InternalServerErrorException(error.message);
    }
  }

  if (error instanceof Error) {
    return error;
  }

  return new InternalServerErrorException("Unexpected IGDB admin error");
};

import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { EMPTY, Observable, from, switchMap } from "rxjs";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";

@Injectable()
export class IgdbTombstoneInterceptor implements NestInterceptor {
  constructor(private readonly tombstoneService: IgdbTombstoneService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      body?: { id?: unknown };
      params: { action?: string; resource?: string };
    }>();
    const response = http.getResponse<{ status(code: number): { send(): void } }>();
    const action = request.params.action;

    if (action === "delete") {
      return next.handle();
    }

    const resource = request.params.resource;

    if (!resource?.length) {
      throw new BadRequestException("Webhook route must include a resource");
    }

    const igdbId = request.body?.id;

    if (typeof igdbId !== "number" || !Number.isInteger(igdbId)) {
      throw new BadRequestException("Webhook payload must include an IGDB ID");
    }

    return from(this.tombstoneService.isTombstoned(resource, igdbId)).pipe(
      switchMap((isTombstoned) => {
        if (isTombstoned) {
          response.status(204).send();
          return EMPTY;
        }

        return next.handle();
      }),
    );
  }
}

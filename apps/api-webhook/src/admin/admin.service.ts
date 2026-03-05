import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../config/app-config.service";
import { IgdbApiService } from "../igdb-api/igdb-api.service";
import { IgdbApiError } from "../igdb-api/types/igdb-api.types";
import type { WebhookAction, WebhookResource } from "../webhooks/igdb/types/igdb-webhook.types";
import { DeleteWebhookResultDto } from "./dto/delete-webhook-result.dto";
import { TestWebhookResultDto } from "./dto/test-webhook-result.dto";
import { WebhookDto } from "./dto/webhook.dto";
import { mapIgdbWebhookRecordToWebhookDto } from "./mappers/map-igdb-webhook-record-to-webhook-dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly igdbApiService: IgdbApiService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private buildWebhookUrl(resource: WebhookResource, action: WebhookAction): string {
    return `${this.configService.publicWebhookBaseUrl}/webhooks/igdb/${resource}/${action}`;
  }

  private mapIgdbApiError(error: unknown): Error {
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
  }

  async createWebhook(resource: WebhookResource, action: WebhookAction): Promise<WebhookDto> {
    const url = this.buildWebhookUrl(resource, action);
    this.logger.info({ action, resource, url }, "Creating IGDB webhook");

    try {
      const webhook = await this.igdbApiService.createWebhook({
        action,
        resource,
        secret: this.configService.igdbWebhookSecret,
        url,
      });

      return mapIgdbWebhookRecordToWebhookDto(webhook, this.configService.publicWebhookBaseUrl);
    } catch (error) {
      throw this.mapIgdbApiError(error);
    }
  }

  async deleteWebhook(webhookId: number): Promise<DeleteWebhookResultDto> {
    this.logger.info({ webhookId }, "Deleting IGDB webhook");

    try {
      const response = await this.igdbApiService.deleteWebhook(webhookId);
      const id = Number(response.id);

      if (Number.isInteger(id) === false) {
        throw new InternalServerErrorException("IGDB delete webhook response did not include a valid id");
      }

      return { id };
    } catch (error) {
      throw this.mapIgdbApiError(error);
    }
  }

  async listWebhooks(): Promise<WebhookDto[]> {
    this.logger.info("Listing IGDB webhooks");

    try {
      const webhooks = await this.igdbApiService.listWebhooks();

      return webhooks.map((webhook) => mapIgdbWebhookRecordToWebhookDto(webhook, this.configService.publicWebhookBaseUrl));
    } catch (error) {
      throw this.mapIgdbApiError(error);
    }
  }

  async testWebhook(webhookId: number, resource: WebhookResource, entityId: number): Promise<TestWebhookResultDto> {
    this.logger.info({ entityId, resource, webhookId }, "Triggering IGDB webhook test");

    try {
      const result = await this.igdbApiService.testWebhook({
        entityId,
        resource,
        webhookId,
      });

      return {
        entityId,
        resource,
        result,
        webhookId,
      };
    } catch (error) {
      throw this.mapIgdbApiError(error);
    }
  }
}

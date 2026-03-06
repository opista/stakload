import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../config/app-config.service";
import { IgdbApiService } from "../igdb-api/igdb-api.service";
import type { IgdbWebhookRecord } from "../igdb-api/types/igdb-api.types";
import type { WebhookAction, WebhookResource } from "../webhooks/types/igdb-webhook.types";
import { DESIRED_MANAGED_WEBHOOK_IDENTITIES } from "./constants/desired-managed-webhook-identities.const";
import { DeleteWebhookResultDto } from "./dto/delete-webhook-result.dto";
import { PurgeWebhooksResultDto } from "./dto/purge-webhooks-result.dto";
import { SyncWebhooksResultDto } from "./dto/sync-webhooks-result.dto";
import { TestWebhookResultDto } from "./dto/test-webhook-result.dto";
import { WebhookOperationErrorDto } from "./dto/webhook-operation-error.dto";
import { WebhookDto } from "./dto/webhook.dto";
import { mapIgdbWebhookRecordToWebhookDto } from "./mappers/map-igdb-webhook-record-to-webhook-dto";
import { buildManagedWebhookKey } from "./utils/build-managed-webhook-key";
import { buildManagedWebhookUrl } from "./utils/build-managed-webhook-url";
import { buildWebhookOperationError } from "./utils/build-webhook-operation-error";
import { compareWebhookAge } from "./utils/compare-webhook-age";
import { mapIgdbApiError } from "./utils/map-igdb-api-error";
import { parseManagedWebhookUrl } from "./utils/parse-managed-webhook-url";

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly igdbApiService: IgdbApiService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async createWebhook(resource: WebhookResource, action: WebhookAction): Promise<WebhookDto> {
    const url = buildManagedWebhookUrl(this.configService.publicWebhookBaseUrl, resource, action);
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
      throw mapIgdbApiError(error);
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
      throw mapIgdbApiError(error);
    }
  }

  async listWebhooks(): Promise<WebhookDto[]> {
    this.logger.info("Listing IGDB webhooks");

    try {
      const webhooks = await this.igdbApiService.listWebhooks();

      return webhooks.map((webhook) =>
        mapIgdbWebhookRecordToWebhookDto(webhook, this.configService.publicWebhookBaseUrl),
      );
    } catch (error) {
      throw mapIgdbApiError(error);
    }
  }

  async purgeWebhooks(confirm: boolean): Promise<PurgeWebhooksResultDto> {
    if (confirm !== true) {
      throw new BadRequestException("The purge operation requires confirm=true");
    }

    this.logger.warn("Purging managed IGDB webhooks");

    try {
      const webhooks = await this.igdbApiService.listWebhooks();
      const managedWebhooks = webhooks.filter(
        (webhook) => parseManagedWebhookUrl(webhook.url, this.configService.publicWebhookBaseUrl) !== null,
      );
      const deleted: DeleteWebhookResultDto[] = [];
      const errors: WebhookOperationErrorDto[] = [];

      for (const webhook of managedWebhooks) {
        const managedIdentity = parseManagedWebhookUrl(webhook.url, this.configService.publicWebhookBaseUrl);

        try {
          const result = await this.deleteWebhook(webhook.id);
          deleted.push(result);
        } catch (error) {
          errors.push(
            buildWebhookOperationError({
              action: managedIdentity?.action ?? null,
              error,
              operation: "delete",
              resource: managedIdentity?.resource ?? null,
              webhookId: webhook.id,
            }),
          );
        }
      }

      return {
        deleted,
        errors,
        totalCandidates: managedWebhooks.length,
      };
    } catch (error) {
      throw mapIgdbApiError(error);
    }
  }

  async syncWebhooks(): Promise<SyncWebhooksResultDto> {
    this.logger.info("Synchronising managed IGDB webhooks");

    try {
      const webhooks = await this.igdbApiService.listWebhooks();
      const created: WebhookDto[] = [];
      const deduplicated: DeleteWebhookResultDto[] = [];
      const errors: WebhookOperationErrorDto[] = [];
      const managedByKey = new Map<string, IgdbWebhookRecord[]>();

      for (const webhook of webhooks) {
        const managedIdentity = parseManagedWebhookUrl(webhook.url, this.configService.publicWebhookBaseUrl);

        if (managedIdentity === null) {
          continue;
        }

        const key = buildManagedWebhookKey(managedIdentity.resource, managedIdentity.action);
        const existing = managedByKey.get(key) ?? [];
        existing.push(webhook);
        managedByKey.set(key, existing);
      }

      let keptCount = 0;

      for (const identity of DESIRED_MANAGED_WEBHOOK_IDENTITIES) {
        const key = buildManagedWebhookKey(identity.resource, identity.action);
        const existing = [...(managedByKey.get(key) ?? [])].sort((first, second) => compareWebhookAge(first, second));

        if (existing.length === 0) {
          try {
            const webhook = await this.createWebhook(identity.resource, identity.action);
            created.push(webhook);
          } catch (error) {
            errors.push(
              buildWebhookOperationError({
                action: identity.action,
                error,
                operation: "create",
                resource: identity.resource,
                webhookId: null,
              }),
            );
          }

          continue;
        }

        keptCount += 1;

        for (const duplicate of existing.slice(1)) {
          try {
            const result = await this.deleteWebhook(duplicate.id);
            deduplicated.push(result);
          } catch (error) {
            errors.push(
              buildWebhookOperationError({
                action: identity.action,
                error,
                operation: "delete",
                resource: identity.resource,
                webhookId: duplicate.id,
              }),
            );
          }
        }
      }

      return {
        created,
        deduplicated,
        desiredCount: DESIRED_MANAGED_WEBHOOK_IDENTITIES.length,
        errors,
        existingManagedCount: [...managedByKey.values()].reduce((count, hooks) => count + hooks.length, 0),
        keptCount,
      };
    } catch (error) {
      throw mapIgdbApiError(error);
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
      throw mapIgdbApiError(error);
    }
  }
}

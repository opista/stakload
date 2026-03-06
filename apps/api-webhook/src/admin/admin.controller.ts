import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { IgdbWebhookSecretGuard } from "../webhooks/guards/igdb-webhook-secret.guard";
import { AdminService } from "./admin.service";
import { CreateWebhookInputDto } from "./dto/create-webhook-input.dto";
import { DeleteWebhookResultDto } from "./dto/delete-webhook-result.dto";
import { PurgeWebhooksResultDto } from "./dto/purge-webhooks-result.dto";
import { SyncWebhooksResultDto } from "./dto/sync-webhooks-result.dto";
import { TestWebhookInputDto } from "./dto/test-webhook-input.dto";
import { TestWebhookResultDto } from "./dto/test-webhook-result.dto";
import { WebhookDto } from "./dto/webhook.dto";

@Controller("admin/webhooks")
@UseGuards(IgdbWebhookSecretGuard)
@UsePipes(
  new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true,
  }),
)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createWebhook(@Body() body: CreateWebhookInputDto): Promise<WebhookDto> {
    return this.adminService.createWebhook(body.resource, body.action);
  }

  @Delete(":webhookId")
  @HttpCode(200)
  async deleteWebhook(@Param("webhookId", ParseIntPipe) webhookId: number): Promise<DeleteWebhookResultDto> {
    return this.adminService.deleteWebhook(webhookId);
  }

  @Get()
  async listWebhooks(): Promise<WebhookDto[]> {
    return this.adminService.listWebhooks();
  }

  @Post("purge")
  async purgeWebhooks(
    @Query("confirm", new DefaultValuePipe(false), ParseBoolPipe) confirm: boolean,
  ): Promise<PurgeWebhooksResultDto> {
    return this.adminService.purgeWebhooks(confirm);
  }

  @Post("sync")
  async syncWebhooks(): Promise<SyncWebhooksResultDto> {
    return this.adminService.syncWebhooks();
  }

  @Post(":webhookId/test")
  @HttpCode(200)
  async testWebhook(
    @Body() body: TestWebhookInputDto,
    @Param("webhookId", ParseIntPipe) webhookId: number,
  ): Promise<TestWebhookResultDto> {
    return this.adminService.testWebhook(webhookId, body.resource, body.entityId);
  }
}

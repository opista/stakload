import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app-config.service";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);
  const host = configService.host;
  const port = configService.port;

  await app.listen(port, host);

  Logger.log(`api-webhook listening on http://${host}:${port}`, "Bootstrap");
}

void bootstrap();

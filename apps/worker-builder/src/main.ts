import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { getPinoLogger, Logger, PinoLogger } from "@stakload/nestjs-logging";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get<Logger>(Logger));

  const logger = await app.resolve<PinoLogger>(PinoLogger);

  logger.setContext("Bootstrap");
  logger.info("worker-builder started");
}

void bootstrap().catch((error: unknown) => {
  getPinoLogger().error(error, "worker-builder bootstrap failed");
  process.exit(1);
});

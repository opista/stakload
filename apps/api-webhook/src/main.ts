import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { getPinoLogger, Logger, PinoLogger } from "@stakload/nestjs-logging";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const logger = await app.resolve(PinoLogger);

  await app.listen(3001);

  logger.info("api-webhook started", "Bootstrap");
}

void bootstrap().catch((error: unknown) => {
  getPinoLogger().error(error, "api-webhook bootstrap failed");
  process.exit(1);
});

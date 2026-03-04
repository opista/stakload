import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseEntitiesModule } from "@stakload/database";

import { AppConfigService } from "../config/app-config.service";
import { IgdbTombstoneEntity } from "./entities/igdb-tombstone.entity";

@Module({
  exports: [TypeOrmModule, DatabaseEntitiesModule],
  imports: [
    DatabaseEntitiesModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        autoLoadEntities: true,
        synchronize: false,
        type: "postgres",
        url: configService.databaseUrl,
      }),
    }),
    TypeOrmModule.forFeature([IgdbTombstoneEntity]),
  ],
})
export class DatabaseModule {}

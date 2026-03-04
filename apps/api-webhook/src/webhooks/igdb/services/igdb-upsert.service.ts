import { Injectable } from "@nestjs/common";
import type { DeepPartial, EntityManager, EntityTarget, ObjectLiteral, QueryRunner, Repository } from "typeorm";

import type { StaleProtectionMode } from "../types/igdb-webhook.types";

@Injectable()
export class IgdbUpsertService {
  private resolveRepository<TEntity extends ObjectLiteral>(
    entity: EntityTarget<TEntity>,
    context: EntityManager | QueryRunner | Repository<TEntity>,
  ): Repository<TEntity> {
    if ("metadata" in context && "save" in context) {
      return context;
    }

    if ("manager" in context && "query" in context) {
      return context.manager.getRepository(entity);
    }

    return context.getRepository(entity);
  }

  async upsert<TEntity extends ObjectLiteral>(
    entity: EntityTarget<TEntity>,
    payload: DeepPartial<TEntity>,
    staleProtection: StaleProtectionMode,
    context: EntityManager | QueryRunner | Repository<TEntity>,
  ): Promise<boolean> {
    const repository = this.resolveRepository(entity, context);
    const sourceUpdatedAt = (payload as { sourceUpdatedAt?: Date | null }).sourceUpdatedAt;
    const payloadRecord = payload as Record<string, unknown>;

    if (staleProtection !== "stale_protected" || sourceUpdatedAt == null) {
      await repository.save(repository.create(payload));
      return true;
    }

    const metadata = repository.metadata;
    const columns = metadata.columns.filter(
      (column) =>
        column.propertyName in payloadRecord &&
        payloadRecord[column.propertyName] !== undefined &&
        column.isCreateDate === false &&
        column.isUpdateDate === false,
    );

    if (columns.length === 0) {
      return false;
    }

    const tableName = metadata.tablePath;
    const insertColumnNames = columns.map((column) => `"${column.databaseName}"`);
    const values = columns.map((column) => payloadRecord[column.propertyName]);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`);
    const updateColumns = columns.filter((column) => column.isPrimary === false);
    const sourceUpdatedColumn = metadata.findColumnWithPropertyName("sourceUpdatedAt");
    const updatedAtColumn = metadata.columns.find((column) => column.isUpdateDate);

    if (!sourceUpdatedColumn) {
      await repository.save(repository.create(payload));
      return true;
    }

    const updateAssignments = updateColumns
      .map((column) => `"${column.databaseName}" = EXCLUDED."${column.databaseName}"`)
      .concat(updatedAtColumn ? [`"${updatedAtColumn.databaseName}" = NOW()`] : []);
    const primaryColumns = metadata.primaryColumns.map((column) => `"${column.databaseName}"`).join(", ");
    const sql = [
      `INSERT INTO ${tableName} (${insertColumnNames.join(", ")})`,
      `VALUES (${valuePlaceholders.join(", ")})`,
      `ON CONFLICT (${primaryColumns}) DO UPDATE SET ${updateAssignments.join(", ")}`,
      `WHERE ${tableName}."${sourceUpdatedColumn.databaseName}" IS NULL`,
      `OR EXCLUDED."${sourceUpdatedColumn.databaseName}" > ${tableName}."${sourceUpdatedColumn.databaseName}"`,
      `RETURNING ${primaryColumns}`,
    ].join(" ");
    const result = await repository.query(sql, values);

    return result.length > 0;
  }
}

import type { RawIgdbPayload } from "../../types/igdb-webhook.types";

export const readArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const readBoolean = (value: unknown): boolean | null => (typeof value === "boolean" ? value : null);

export const readDate = (value: unknown): Date | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value * 1000);
  }

  if (typeof value === "string" && value.length > 0) {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

export const readDateOnly = (value: unknown): string | null => {
  const parsed = readDate(value);

  if (!parsed) {
    return typeof value === "string" && value.length > 0 ? value : null;
  }

  return parsed.toISOString().slice(0, 10);
};

export const readId = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value === "object" && value !== null && "id" in value) {
    return readId((value as { id?: unknown }).id);
  }

  return null;
};

export const readOptionalId = (value: unknown): number | undefined => readId(value) ?? undefined;

export const readIds = (value: unknown): number[] =>
  readArray(value)
    .map(readId)
    .filter((id): id is number => id !== null);

export const readNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

export const readString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

export const mapBaseImageAsset = (payload: RawIgdbPayload) => ({
  alphaChannel: readBoolean(payload.alpha_channel),
  animated: readBoolean(payload.animated),
  checksum: readString(payload.checksum),
  height: readNumber(payload.height),
  igdbId: readId(payload.id) ?? 0,
  imageId: readString(payload.image_id),
  sourceUpdatedAt: readDate(payload.updated_at),
  url: readString(payload.url),
  width: readNumber(payload.width),
});

export const mapBaseNamed = (payload: RawIgdbPayload) => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  name: readString(payload.name) ?? "",
  sourceUpdatedAt: readDate(payload.updated_at),
});

export const mapBaseSlugged = (payload: RawIgdbPayload) => ({
  ...mapBaseNamed(payload),
  slug: readString(payload.slug),
  url: readString(payload.url),
});

import {
  mapBaseImageAsset,
  mapBaseNamed,
  mapBaseSlugged,
  readArray,
  readBoolean,
  readDate,
  readDateOnly,
  readId,
  readIds,
  readNumber,
  readOptionalId,
  readString,
} from "./mapper-utils";

describe("mapper-utils", () => {
  it("should read arrays safely", () => {
    expect(readArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(readArray("nope")).toEqual([]);
  });

  it("should read booleans safely", () => {
    expect(readBoolean(true)).toBe(true);
    expect(readBoolean(false)).toBe(false);
    expect(readBoolean("true")).toBeNull();
  });

  it("should read dates from date objects, unix seconds, and iso strings", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");

    expect(readDate(date)).toBe(date);
    expect(readDate(1_704_067_200)?.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    expect(readDate("2024-01-01T00:00:00.000Z")?.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    expect(readDate("not-a-date")).toBeNull();
  });

  it("should read date-only values safely", () => {
    expect(readDateOnly("2024-01-01T00:00:00.000Z")).toBe("2024-01-01");
    expect(readDateOnly("2024-01-01")).toBe("2024-01-01");
    expect(readDateOnly("not-a-date")).toBe("not-a-date");
    expect(readDateOnly(1_704_067_200)).toBe("2024-01-01");
  });

  it("should read ids from integers and nested objects", () => {
    expect(readId(42)).toBe(42);
    expect(readId({ id: 7 })).toBe(7);
    expect(readId("42")).toBeNull();
    expect(readOptionalId(undefined)).toBeUndefined();
    expect(readOptionalId({ id: 9 })).toBe(9);
    expect(readIds([1, { id: 2 }, "bad", null])).toEqual([1, 2]);
  });

  it("should read numbers and strings safely", () => {
    expect(readNumber(4.2)).toBe(4.2);
    expect(readNumber("4.2")).toBeNull();
    expect(readString("hello")).toBe("hello");
    expect(readString("")).toBeNull();
  });

  it("should map base image assets", () => {
    expect(
      mapBaseImageAsset({
        alpha_channel: true,
        animated: false,
        checksum: "checksum",
        height: 100,
        id: 12,
        image_id: "image-id",
        updated_at: 1_704_067_200,
        url: "https://example.com",
        width: 200,
      } as never),
    ).toEqual({
      alphaChannel: true,
      animated: false,
      checksum: "checksum",
      height: 100,
      igdbId: 12,
      imageId: "image-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      url: "https://example.com",
      width: 200,
    });
  });

  it("should map base named and slugged payloads", () => {
    expect(
      mapBaseNamed({
        checksum: "checksum",
        id: 12,
        name: "Name",
        updated_at: 1_704_067_200,
      } as never),
    ).toEqual({
      checksum: "checksum",
      igdbId: 12,
      name: "Name",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });

    expect(
      mapBaseSlugged({
        checksum: "checksum",
        id: 12,
        name: "Name",
        slug: "name",
        updated_at: 1_704_067_200,
        url: "https://example.com",
      } as never),
    ).toEqual({
      checksum: "checksum",
      igdbId: 12,
      name: "Name",
      slug: "name",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      url: "https://example.com",
    });
  });
});

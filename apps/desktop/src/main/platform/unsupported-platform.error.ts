export class UnsupportedPlatformError extends Error {
  constructor(
    public readonly capability: string,
    public readonly platform: NodeJS.Platform,
  ) {
    super(`${capability} is not supported on platform "${platform}"`);
    this.name = UnsupportedPlatformError.name;
  }
}

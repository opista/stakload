import { DesktopPlatform, isDesktopPlatform } from "./types";
import { UnsupportedPlatformError } from "./unsupported-platform.error";

type PlatformImplementationMap<T> = Partial<Record<DesktopPlatform, T>>;

export const resolvePlatformImplementation = <T>(
  capability: string,
  implementations: PlatformImplementationMap<T>,
  platform: NodeJS.Platform = process.platform,
): T => {
  if (!isDesktopPlatform(platform)) {
    throw new UnsupportedPlatformError(capability, platform);
  }

  const implementation = implementations[platform];
  if (!implementation) {
    throw new UnsupportedPlatformError(capability, platform);
  }

  return implementation;
};

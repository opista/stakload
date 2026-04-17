export const DESKTOP_PLATFORMS = ["darwin", "win32", "linux"] as const;

export type DesktopPlatform = (typeof DESKTOP_PLATFORMS)[number];

export const isDesktopPlatform = (platform: NodeJS.Platform): platform is DesktopPlatform =>
  DESKTOP_PLATFORMS.includes(platform as DesktopPlatform);

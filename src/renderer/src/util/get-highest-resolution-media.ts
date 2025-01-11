import { Media } from "@contracts/database/games";

export const getHighestResolutionMedia = (media?: Media[]) => {
  if (!media) return null;

  const sortedMedia = media.sort((a, b) => a.width * a.height - b.width * b.height);
  const landscapeMedia = sortedMedia.find((m) => m.width > m.height);
  return landscapeMedia || sortedMedia[0] || null;
};

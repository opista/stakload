import { Media } from "@contracts/database/games";

const ratio = ({ height, width }: { height: number; width: number }) => width / height;

export const getHighestRatioMedia = (media?: Media[]) => {
  if (!media) return null;

  return media.reduce<Media>((accumulator, item) => {
    const prev = ratio(accumulator);
    const current = ratio(item);
    return prev > current ? accumulator : item;
  }, media[0]);
};

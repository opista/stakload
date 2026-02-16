export { IconBrandBattleNet } from "./IconBrandBattleNet";
export { IconBrandEpicGames } from "./IconBrandEpicGames";
export { IconBrandFandom } from "./IconBrandFandom";
export { IconBrandGog } from "./IconBrandGog";
export { IconBrandProtonDb } from "./IconBrandProtonDb";
export * from "@tabler/icons-react";
const tablerIconsJson = {};

import customIconsJson from "./custom-icons.json";

export const fullIconsList = [...Object.values(tablerIconsJson), ...customIconsJson].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const filterIcons = (query: string) => {
  const formattedQuery = query.toLocaleLowerCase().trim();

  if (!formattedQuery) return fullIconsList;

  return fullIconsList.filter(
    (icon) =>
      icon.name.toLocaleLowerCase().split("-").join(" ").includes(formattedQuery) ||
      icon.category.toLocaleLowerCase().includes(formattedQuery) ||
      icon.tags?.some((tag: string | number | null) => tag?.toString().toLocaleLowerCase().includes(formattedQuery)),
  );
};

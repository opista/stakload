export { IconBrandBattleNet } from "./icon-brand-battle-net";
export { IconBrandEpicGames } from "./icon-brand-epic-games";
export { IconBrandFandom } from "./icon-brand-fandom";
export { IconBrandGog } from "./icon-brand-gog";
export { IconBrandProtonDb } from "./icon-brand-proton-db";
export * from "@tabler/icons-react";
const tablerIconsJson = {};

import customIconsJson from "./custom-icons.json";

interface IconData {
  category: string;
  name: string;
  tags?: string[];
}

export const fullIconsList = [...Object.values(tablerIconsJson), ...customIconsJson].sort((a, b) =>
  (a as IconData).name.localeCompare((b as IconData).name),
) as IconData[];

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

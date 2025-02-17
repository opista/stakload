export { IconBrandEpicGames } from "./IconBrandEpicGames";
export { IconBrandFandom } from "./IconBrandFandom";
export { IconBrandGog } from "./IconBrandGog";
export { IconBrandProtonDb } from "./IconBrandProtonDb";
export * from "@tabler/icons-react";
import tablerIconsJson from "@tabler/icons/icons.json";

import customIconsJson from "./custom-icons.json";

export const fullIconsList = [...Object.values(tablerIconsJson), ...customIconsJson].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export const filterIcons = (query: string) => {
  return fullIconsList.filter(
    (icon) =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.category.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags?.some((tag: string | number | null) => tag?.toString().toLowerCase().includes(query.toLowerCase())),
  );
};

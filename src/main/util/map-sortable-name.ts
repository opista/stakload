export const mapSortableName = (name: string) => {
  const articleRegex = /^(the|a|an)\s+/i;
  const match = name.match(articleRegex);

  if (match) {
    // If an article is found, move it to the end with a comma
    return name.replace(articleRegex, "").trim() + `, ${match[1]}`;
  }

  // If no article is found, return the name as-is
  return name;
};

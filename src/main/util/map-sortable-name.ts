export const mapSortableName = (name: string) => {
  const articleRegex = /^(the|a|an)\s+/i;
  const match = name.match(articleRegex);

  if (match) {
    return name.replace(articleRegex, "").trim() + `, ${match[1]}`;
  }

  return name;
};

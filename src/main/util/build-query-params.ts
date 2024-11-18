export const buildQueryParams = (query?: Record<string, string>) => {
  if (!query) return "";

  const params = new URLSearchParams(query).toString();
  return params ? `?${params}` : "";
};

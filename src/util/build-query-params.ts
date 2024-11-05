export const buildQueryParams = (val: Record<string, string>) => {
  const params = new URLSearchParams(val).toString();
  return params ? `?${params}` : "";
};

export const withQuery = (
  url: string,
  params: Record<string, string | number | undefined>
) => {
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined)
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v as string | number)}`
    )
    .join("&");
  return query ? `${url}?${query}` : url;
};

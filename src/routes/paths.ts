export const paths = {
  home: "/",
  search: (query: string) => `/search?${new URLSearchParams({ q: query })}`,
  watch: (id: string) => `/watch/${encodeURIComponent(id)}`,
  channel: (id: string) =>
    `https://www.youtube.com/channel/${encodeURIComponent(id)}`,
  youtube: (id: string) =>
    `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`,
  library: (collection = "saved") => `/library/${collection}`,
};

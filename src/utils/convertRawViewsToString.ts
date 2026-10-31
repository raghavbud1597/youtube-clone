const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const fullFormatter = new Intl.NumberFormat("en");

export function formatCount(value: string | number | null): string {
  if (value === null || !Number.isFinite(Number(value))) return "—";
  return compactFormatter.format(Number(value));
}

export function formatViews(value: string | number | null): string {
  if (value === null || !Number.isFinite(Number(value))) return "—";
  return fullFormatter.format(Number(value));
}

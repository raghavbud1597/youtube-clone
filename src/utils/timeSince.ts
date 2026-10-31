export function timeSince(date: string | Date, now = Date.now()): string {
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return "Unknown date";
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  const units: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (seconds >= size) {
      const count = Math.floor(seconds / size);
      return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
}

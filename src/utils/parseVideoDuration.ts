export function parseVideoDuration(duration: string): string {
  const match =
    /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/.exec(
      duration,
    );
  if (!match) return "0:00";
  const hours = Number(match[1] ?? 0) * 24 + Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Math.floor(Number(match[4] ?? 0));
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

import { describe, expect, it } from "vitest";
import { parseVideoDuration } from "./parseVideoDuration";
import { formatCount, formatViews } from "./convertRawViewsToString";
import { timeSince } from "./timeSince";

describe("video presentation formatting", () => {
  it.each([
    ["PT9S", "0:09"],
    ["PT9M9S", "9:09"],
    ["PT1H9M9S", "1:09:09"],
    ["PT1H", "1:00:00"],
    ["PT1H9S", "1:00:09"],
    ["P1DT2H", "26:00:00"],
    ["", "0:00"],
  ])("formats %s as %s", (value, expected) =>
    expect(parseVideoDuration(value)).toBe(expected),
  );

  it("formats counts and hidden statistics", () => {
    expect(formatCount("1234")).toBe("1.2K");
    expect(formatViews("1234")).toBe("1,234");
    expect(formatCount(null)).toBe("—");
  });

  it("handles singular time units, future timestamps, and invalid dates", () => {
    const now = Date.parse("2026-10-31T12:00:00Z");
    expect(timeSince("2026-10-31T11:00:00Z", now)).toBe("1 hour ago");
    expect(timeSince("2026-10-31T10:00:00Z", now)).toBe("2 hours ago");
    expect(timeSince("2027-01-01", now)).toBe("Just now");
    expect(timeSince("invalid", now)).toBe("Unknown date");
  });
});

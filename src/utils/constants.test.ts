import { describe, expect, it, vi } from "vitest";

describe("YouTube API environment migration", () => {
  it("prefers the Vite API key when both names are configured", async () => {
    vi.stubEnv("VITE_YOUTUBE_DATA_API_KEY", "vite-test-key");
    vi.stubEnv("REACT_APP_YOUTUBE_DATA_API_KEY", "legacy-test-key");
    vi.resetModules();

    const { YOUTUBE_API_KEY } = await import("./constants");
    expect(YOUTUBE_API_KEY).toBe("vite-test-key");
  });

  it("supports the existing Create React App API key without editing .env", async () => {
    vi.stubEnv("VITE_YOUTUBE_DATA_API_KEY", undefined);
    vi.stubEnv("REACT_APP_YOUTUBE_DATA_API_KEY", "legacy-test-key");
    vi.resetModules();

    const { YOUTUBE_API_KEY } = await import("./constants");
    expect(YOUTUBE_API_KEY).toBe("legacy-test-key");
  });
});

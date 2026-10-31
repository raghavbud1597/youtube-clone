import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { store } from "..";
import { getHomePageVideos } from "./getHomePageVideos";

vi.mock("../../utils/constants", () => ({
  YOUTUBE_API_URL: "https://youtube.googleapis.com/youtube/v3",
  YOUTUBE_API_KEY: "test-key",
}));

const searchItem = {
  id: { videoId: "video-1" },
  snippet: {
    channelId: "channel-1",
    channelTitle: "Example channel",
    title: "Example video",
    description: "Example description",
    thumbnails: { medium: { url: "https://example.com/video.jpg" } },
    publishedAt: "2026-01-01T00:00:00Z",
  },
};

beforeEach(() => {
  store.dispatch(getHomePageVideos.fulfilled(
    { parsedData: [], nextPageToken: null }, "reset", false
  ));
});

describe("YouTube loading after the dependency migration", () => {
  it("uses one API key for search, channels, and video details, then preserves videos while paging", async () => {
    const get = vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { items: [searchItem], nextPageToken: "page-2" } })
      .mockResolvedValueOnce({ data: { items: [{
        id: "channel-1",
        snippet: { thumbnails: { default: { url: "https://example.com/channel.jpg" } } },
      }] } })
      .mockResolvedValueOnce({ data: { items: [{
        contentDetails: { duration: "PT1M30S" },
        statistics: { viewCount: "1234" },
      }] } });

    const action = await store.dispatch(getHomePageVideos(false));
    expect(getHomePageVideos.fulfilled.match(action)).toBe(true);
    expect(store.getState().youtubeApp.videos).toEqual([
      expect.objectContaining({
        videoId: "video-1", videoDuration: "1:30", videoViews: "1K",
        channelInfo: expect.objectContaining({ id: "channel-1" }),
      }),
    ]);
    expect(get).toHaveBeenNthCalledWith(2, expect.stringContaining("key=test-key"));
    expect(get).toHaveBeenNthCalledWith(3, expect.stringContaining("key=test-key"));

    get.mockResolvedValueOnce({ data: { items: [] } });
    await store.dispatch(getHomePageVideos(true));
    expect(get).toHaveBeenLastCalledWith(
      expect.stringContaining("/search"),
      expect.objectContaining({ params: expect.objectContaining({ pageToken: "page-2" }) })
    );
    expect(store.getState().youtubeApp.videos).toHaveLength(1);
    expect(store.getState().youtubeApp.nextPageToken).toBeNull();

    get.mockResolvedValueOnce({ data: { items: [] } });
    await store.dispatch(getHomePageVideos(false));
    expect(store.getState().youtubeApp.videos).toEqual([]);
  });

  it("rejects failed detail requests without replacing the store with invalid data", async () => {
    vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { items: [searchItem] } })
      .mockRejectedValueOnce(new Error("API unavailable"));

    const action = await store.dispatch(getHomePageVideos(false));
    expect(getHomePageVideos.rejected.match(action)).toBe(true);
    if (getHomePageVideos.rejected.match(action)) {
      expect(action.error.message).toBe("API unavailable");
    }
    expect(store.getState().youtubeApp.videos).toEqual([]);
  });
});

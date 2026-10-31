import { beforeEach, describe, expect, it, vi } from "vitest";
import { youtubeRequest } from "../../services/youtubeClient";
import {
  getChannelRecommendations,
  getVideoDetails,
  getVideoPage,
  getVideosByIds,
} from "./api";

vi.mock("../../services/youtubeClient", () => ({ youtubeRequest: vi.fn() }));

function resource(id: string) {
  return {
    id,
    snippet: {
      title: id,
      description: "Description",
      channelId: "channel-1",
      channelTitle: "Channel",
      publishedAt: "2026-01-01",
      thumbnails: { high: { url: `${id}.jpg` } },
    },
    contentDetails: { duration: "PT1H9M9S" },
    statistics: { viewCount: "500", likeCount: "12" },
  };
}

beforeEach(() => {
  vi.mocked(youtubeRequest).mockReset();
});

describe("YouTube service mapping", () => {
  it("joins metadata by IDs and preserves search order when API items are reordered or missing", async () => {
    vi.mocked(youtubeRequest)
      .mockResolvedValueOnce({
        items: [
          { id: { videoId: "first" } },
          { id: { videoId: "removed" } },
          { id: { videoId: "second" } },
        ],
        nextPageToken: "next",
      })
      .mockResolvedValueOnce({ items: [resource("second"), resource("first")] })
      .mockResolvedValueOnce({
        items: [
          {
            id: "channel-1",
            snippet: {
              title: "Channel name",
              thumbnails: { default: { url: "channel.jpg" } },
            },
            statistics: { subscriberCount: "1234" },
          },
        ],
      });
    const page = await getVideoPage("react & typescript", "previous");
    expect(page.items.map((video) => video.id)).toEqual(["first", "second"]);
    expect(page.items[0]).toMatchObject({
      duration: "1:09:09",
      channel: { image: "channel.jpg", subscribers: "1234" },
    });
    expect(page.nextPageToken).toBe("next");
    expect(youtubeRequest).toHaveBeenNthCalledWith(
      1,
      "search",
      expect.objectContaining({
        q: "react & typescript",
        pageToken: "previous",
        type: "video",
      }),
      undefined,
    );
  });

  it("returns an empty page without requesting empty videos or channel IDs", async () => {
    vi.mocked(youtubeRequest).mockResolvedValueOnce({ items: [] });
    expect(await getVideoPage("nothing")).toEqual({
      items: [],
      nextPageToken: null,
    });
    expect(youtubeRequest).toHaveBeenCalledTimes(1);
    expect(await getVideosByIds([])).toEqual([]);
  });

  it("handles missing channel metadata and missing statistics", async () => {
    vi.mocked(youtubeRequest)
      .mockResolvedValueOnce({
        items: [{ ...resource("video"), statistics: undefined }],
      })
      .mockResolvedValueOnce({ items: [] });
    expect(await getVideoDetails("video")).toMatchObject({
      views: null,
      likes: null,
      channel: {
        id: "channel-1",
        name: "Channel",
        image: "",
        subscribers: null,
      },
    });
  });

  it("reports removed videos explicitly", async () => {
    vi.mocked(youtubeRequest).mockResolvedValueOnce({ items: [] });
    await expect(getVideoDetails("removed")).rejects.toThrow("unavailable");
  });

  it("filters the current video and duplicate uploads from channel recommendations", async () => {
    vi.mocked(youtubeRequest)
      .mockResolvedValueOnce({
        items: [
          { contentDetails: { upload: { videoId: "current" } } },
          { contentDetails: { upload: { videoId: "other" } } },
          { contentDetails: { upload: { videoId: "other" } } },
          { contentDetails: {} },
        ],
      })
      .mockResolvedValueOnce({ items: [resource("other")] })
      .mockResolvedValueOnce({ items: [] });
    const videos = await getChannelRecommendations("current", "channel-1");
    expect(videos.map((video) => video.id)).toEqual(["other"]);
    expect(youtubeRequest).toHaveBeenNthCalledWith(
      1,
      "activities",
      { part: "contentDetails", channelId: "channel-1", maxResults: 25 },
      undefined,
    );
  });
});

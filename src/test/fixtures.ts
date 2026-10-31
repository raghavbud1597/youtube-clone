import type { Video } from "../features/videos/types";

export function makeVideo(
  id = "video-1",
  overrides: Partial<Video> = {},
): Video {
  return {
    id,
    title: `Video ${id}`,
    description: "First line\nSecond line\nThird line\nFourth line\nFifth line",
    thumbnail: `https://example.com/${id}.jpg`,
    duration: "4:09",
    views: "1234",
    likes: "42",
    publishedAt: "2026-01-01T00:00:00Z",
    channel: {
      id: "channel-1",
      name: "Example channel",
      image: "https://example.com/channel.jpg",
      subscribers: "12000",
    },
    ...overrides,
  };
}

import { youtubeRequest } from "../../services/youtubeClient";
import { parseVideoDuration } from "../../utils/parseVideoDuration";
import type { Channel, Video, VideoPage } from "./types";

interface Thumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
}

interface VideoResource {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: Thumbnails;
    liveBroadcastContent?: string;
  };
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string; likeCount?: string };
}

interface ChannelResource {
  id: string;
  snippet: { title: string; thumbnails: Thumbnails };
  statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean };
}

interface SearchResource {
  id: { videoId?: string };
}

interface ActivityResource {
  contentDetails?: { upload?: { videoId?: string } };
}

function getThumbnail(thumbnails: Thumbnails, avatar = false): string {
  return (
    (avatar ? thumbnails.default?.url : thumbnails.high?.url) ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    ""
  );
}

function mapChannel(channel: ChannelResource): Channel {
  return {
    id: channel.id,
    name: channel.snippet.title,
    image: getThumbnail(channel.snippet.thumbnails, true),
    subscribers: channel.statistics?.hiddenSubscriberCount
      ? null
      : (channel.statistics?.subscriberCount ?? null),
  };
}

export async function getVideosByIds(
  ids: string[],
  signal?: AbortSignal,
): Promise<Video[]> {
  const uniqueIds = [...new Set(ids)].slice(0, 50);
  if (!uniqueIds.length) return [];
  const { items = [] } = await youtubeRequest<VideoResource>(
    "videos",
    {
      part: "snippet,contentDetails,statistics",
      id: uniqueIds.join(","),
    },
    signal,
  );
  if (!items.length) return [];
  const channelIds = [...new Set(items.map((item) => item.snippet.channelId))];
  const { items: channels = [] } = await youtubeRequest<ChannelResource>(
    "channels",
    {
      part: "snippet,statistics",
      id: channelIds.join(","),
    },
    signal,
  );
  const channelMap = new Map(
    channels.map((channel) => [channel.id, mapChannel(channel)]),
  );
  const videoMap = new Map(
    items.map((item): [string, Video] => [
      item.id,
      {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: getThumbnail(item.snippet.thumbnails),
        duration:
          item.snippet.liveBroadcastContent === "live"
            ? "LIVE"
            : parseVideoDuration(item.contentDetails?.duration ?? ""),
        views: item.statistics?.viewCount ?? null,
        likes: item.statistics?.likeCount ?? null,
        publishedAt: item.snippet.publishedAt,
        channel: channelMap.get(item.snippet.channelId) ?? {
          id: item.snippet.channelId,
          name: item.snippet.channelTitle,
          image: "",
          subscribers: null,
        },
      },
    ]),
  );
  return uniqueIds.flatMap((id) => {
    const video = videoMap.get(id);
    return video ? [video] : [];
  });
}

export async function getVideoPage(
  query: string,
  pageToken?: string,
  signal?: AbortSignal,
): Promise<VideoPage> {
  const { items = [], nextPageToken } = await youtubeRequest<SearchResource>(
    "search",
    {
      part: "snippet",
      type: "video",
      maxResults: 20,
      q: query,
      pageToken,
    },
    signal,
  );
  const ids = items.flatMap((item) =>
    item.id.videoId ? [item.id.videoId] : [],
  );
  return {
    items: await getVideosByIds(ids, signal),
    nextPageToken: nextPageToken ?? null,
  };
}

export async function getVideoDetails(
  id: string,
  signal?: AbortSignal,
): Promise<Video> {
  const [video] = await getVideosByIds([id], signal);
  if (!video) throw new Error("This video is unavailable or has been removed.");
  return video;
}

export async function getChannelRecommendations(
  videoId: string,
  channelId: string,
  signal?: AbortSignal,
): Promise<Video[]> {
  const { items = [] } = await youtubeRequest<ActivityResource>(
    "activities",
    {
      part: "contentDetails",
      channelId,
      maxResults: 25,
    },
    signal,
  );
  const ids = items.flatMap((item) => {
    const id = item.contentDetails?.upload?.videoId;
    return id && id !== videoId ? [id] : [];
  });
  return getVideosByIds(ids, signal);
}

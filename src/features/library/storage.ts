import { initialLibraryState } from "./slice";
import type { LibraryState } from "./slice";
import type { Channel, Video } from "../videos/types";

export const LIBRARY_STORAGE_KEY = "youtube-clone-library-v1";

function isChannel(value: unknown): value is Channel {
  if (!value || typeof value !== "object") return false;
  const channel = value as Partial<Channel>;
  return (
    typeof channel.id === "string" &&
    typeof channel.name === "string" &&
    typeof channel.image === "string" &&
    (channel.subscribers === null || typeof channel.subscribers === "string")
  );
}

function isVideo(value: unknown): value is Video {
  if (!value || typeof value !== "object") return false;
  const video = value as Partial<Video>;
  return (
    [
      video.id,
      video.title,
      video.description,
      video.thumbnail,
      video.duration,
      video.publishedAt,
    ].every((field) => typeof field === "string") &&
    isChannel(video.channel) &&
    (video.views === null || typeof video.views === "string") &&
    (video.likes === null || typeof video.likes === "string")
  );
}

export function loadLibrary(): LibraryState {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(LIBRARY_STORAGE_KEY) ?? "null",
    );
    if (!raw || typeof raw !== "object") return initialLibraryState;
    const data = raw as Record<string, unknown>;
    return {
      history: Array.isArray(data.history)
        ? data.history.filter(isVideo).slice(0, 100)
        : [],
      saved: Array.isArray(data.saved)
        ? data.saved.filter(isVideo).slice(0, 200)
        : [],
      liked: Array.isArray(data.liked)
        ? data.liked.filter(isVideo).slice(0, 200)
        : [],
      dislikedIds: Array.isArray(data.dislikedIds)
        ? data.dislikedIds
            .filter((id): id is string => typeof id === "string")
            .slice(-200)
        : [],
      subscriptions: Array.isArray(data.subscriptions)
        ? data.subscriptions.filter(isChannel).slice(-200)
        : [],
    };
  } catch {
    return initialLibraryState;
  }
}

export function saveLibrary(library: LibraryState): void {
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
  } catch {
    return;
  }
}

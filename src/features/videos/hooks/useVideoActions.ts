import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  toggleDisliked,
  toggleLiked,
  toggleSaved,
  toggleSubscription,
} from "../../library/slice";
import type { Video } from "../types";

export function useVideoActions(video: Video) {
  const dispatch = useAppDispatch();
  const liked = useAppSelector((state) =>
    state.library.liked.some((item) => item.id === video.id),
  );
  const disliked = useAppSelector((state) =>
    state.library.dislikedIds.includes(video.id),
  );
  const saved = useAppSelector((state) =>
    state.library.saved.some((item) => item.id === video.id),
  );
  const subscribed = useAppSelector((state) =>
    state.library.subscriptions.some(
      (channel) => channel.id === video.channel.id,
    ),
  );
  const [shareStatus, setShareStatus] = useState("");

  async function share() {
    const url = `${window.location.origin}/watch/${encodeURIComponent(video.id)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
        setShareStatus("Link shared");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareStatus("Link copied");
      } else {
        setShareStatus(
          "Copy the link from your address bar to share this video.",
        );
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setShareStatus(
          "Couldn't share the link. You can copy it from your address bar.",
        );
      }
    }
  }

  return {
    liked,
    disliked,
    saved,
    subscribed,
    shareStatus,
    share,
    toggleLike: () => dispatch(toggleLiked(video)),
    toggleDislike: () => dispatch(toggleDisliked(video.id)),
    toggleSave: () => dispatch(toggleSaved(video)),
    toggleSubscribe: () => dispatch(toggleSubscription(video.channel)),
  };
}

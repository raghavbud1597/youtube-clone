import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchFeed } from "../actions";
import { selectFeed } from "../selectors";
import type { FeedKind } from "../types";

export function useVideoFeed(kind: FeedKind, query: string) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const feed = useAppSelector((state) => selectFeed(state, kind));
  const pageRequest = useRef<{ abort: () => void } | null>(null);

  useEffect(() => {
    if (!query) return;
    const request = dispatch(fetchFeed({ kind, query }));
    return () => {
      request.abort();
      pageRequest.current?.abort();
    };
  }, [dispatch, kind, query, location.key]);

  const loadMore = useCallback(() => {
    if (
      !feed.nextPageToken ||
      feed.status === "loading" ||
      feed.query !== query
    )
      return;
    pageRequest.current = dispatch(
      fetchFeed({ kind, query, pageToken: feed.nextPageToken }),
    );
  }, [dispatch, kind, query, feed.nextPageToken, feed.status, feed.query]);

  const retry = useCallback(() => {
    if (feed.items.length && feed.nextPageToken) loadMore();
    else pageRequest.current = dispatch(fetchFeed({ kind, query }));
  }, [dispatch, kind, query, feed.items.length, feed.nextPageToken, loadMore]);

  return {
    ...feed,
    loadMore,
    retry,
    hasMore: Boolean(feed.nextPageToken),
    isLoading: feed.status === "loading",
  };
}

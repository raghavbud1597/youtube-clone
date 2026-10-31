import FeedbackState from "../../../components/common/FeedbackState";
import Spinner from "../../../components/common/Spinner";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useVideoFeed } from "../hooks/useVideoFeed";
import type { FeedKind } from "../types";
import VideoCard from "./VideoCard";

export default function VideoFeed({
  kind,
  query,
}: {
  kind: FeedKind;
  query: string;
}) {
  const feed = useVideoFeed(kind, query);
  const sentinelRef = useInfiniteScroll(
    feed.loadMore,
    feed.hasMore && !feed.isLoading && !feed.error,
  );
  const currentItems = feed.query === query ? feed.items : [];

  return (
    <section
      className={`video-feed ${kind === "search" ? "search-feed" : "home-feed"}`}
      aria-label={
        kind === "search" ? `Search results for ${query}` : "Home videos"
      }
      aria-busy={feed.isLoading}
    >
      {kind === "search" && (
        <h1 className="search-heading">
          Search results for <span>{query}</span>
        </h1>
      )}
      {kind === "home" && <h1 className="sr-only">Home</h1>}
      {currentItems.length > 0 && (
        <div className={kind === "search" ? "search-results" : "video-grid"}>
          {currentItems.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              variant={kind === "search" ? "search" : "grid"}
            />
          ))}
        </div>
      )}
      {feed.error && (
        <FeedbackState
          error
          title="Couldn't load videos"
          message={feed.error}
          onRetry={feed.retry}
        />
      )}
      {(feed.isLoading || feed.status === "idle") && !feed.error && <Spinner />}
      {!currentItems.length && feed.status === "succeeded" && (
        <FeedbackState
          title="No videos found"
          message={
            kind === "search"
              ? "Try a different search or check your spelling."
              : "There aren't any videos to show right now."
          }
        />
      )}
      <div ref={sentinelRef} className="feed-sentinel" />
      {feed.hasMore && !feed.isLoading && !feed.error && (
        <button
          type="button"
          className="secondary-button load-more"
          onClick={feed.loadMore}
        >
          Load more videos
        </button>
      )}
    </section>
  );
}

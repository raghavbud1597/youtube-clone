import FeedbackState from "../../../components/common/FeedbackState";
import Spinner from "../../../components/common/Spinner";
import type { ResourceState, Video } from "../types";
import VideoCard from "./VideoCard";

export default function Recommendations({
  resource,
  retry,
}: {
  resource: ResourceState<Video[]>;
  retry: () => void;
}) {
  return (
    <aside className="recommendations" aria-label="Recommended videos">
      <h2>More from this channel</h2>
      {resource.status === "loading" && (
        <Spinner label="Loading recommendations" />
      )}
      {resource.error && (
        <FeedbackState
          error
          title="Couldn't load recommendations"
          message={resource.error}
          onRetry={retry}
        />
      )}
      {resource.data.map((video) => (
        <VideoCard key={video.id} video={video} variant="compact" />
      ))}
      {resource.status === "succeeded" && !resource.data.length && (
        <p className="muted">No more videos from this channel.</p>
      )}
    </aside>
  );
}

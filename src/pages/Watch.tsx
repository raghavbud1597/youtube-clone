import { Navigate, useParams } from "react-router";
import FeedbackState from "../components/common/FeedbackState";
import Spinner from "../components/common/Spinner";
import Recommendations from "../features/videos/components/Recommendations";
import VideoDetails from "../features/videos/components/VideoDetails";
import VideoPlayer from "../features/videos/components/VideoPlayer";
import { useWatchVideo } from "../features/videos/hooks/useWatchVideo";
import { usePageTitle } from "../hooks/usePageTitle";
import { paths } from "../routes/paths";

export default function Watch() {
  const { id = "" } = useParams();
  const watch = useWatchVideo(id);
  usePageTitle(watch.video?.title ?? "Watch");
  if (!id) return <Navigate to={paths.home} replace />;
  if (watch.error)
    return (
      <FeedbackState
        error
        title="Couldn't open this video"
        message={watch.error}
        onRetry={watch.retry}
      />
    );
  if (!watch.video) return <Spinner label="Loading video" />;

  return (
    <div className="watch-page">
      <section className="watch-main" aria-label="Video player and details">
        <VideoPlayer id={watch.video.id} title={watch.video.title} />
        <VideoDetails key={watch.video.id} video={watch.video} />
      </section>
      <Recommendations
        resource={watch.recommendations}
        retry={watch.retryRecommendations}
      />
    </div>
  );
}

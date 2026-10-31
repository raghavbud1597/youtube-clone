import { Navigate, useParams } from "react-router";
import Avatar from "../components/common/Avatar";
import FeedbackState from "../components/common/FeedbackState";
import { clearHistory } from "../features/library/slice";
import VideoCard from "../features/videos/components/VideoCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { paths } from "../routes/paths";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const collections = {
  saved: {
    title: "Watch Later",
    empty: "Save a video from its watch page to find it here.",
  },
  history: {
    title: "Watch history",
    empty: "Videos you watch will appear here.",
  },
  liked: { title: "Liked videos", empty: "Videos you like will appear here." },
  subscriptions: {
    title: "Subscriptions",
    empty: "Subscribe to a channel from a video's watch page.",
  },
};

type Collection = keyof typeof collections;

export default function Library() {
  const { collection = "saved" } = useParams();
  const library = useAppSelector((state) => state.library);
  const dispatch = useAppDispatch();
  const valid = Object.hasOwn(collections, collection);
  const selected = valid ? (collection as Collection) : "saved";
  const config = collections[selected];
  usePageTitle(config.title);
  if (!valid) return <Navigate to={paths.library()} replace />;
  const items = selected === "subscriptions" ? [] : library[selected];

  return (
    <section className="library-page">
      <div className="library-heading">
        <div>
          <h1>{config.title}</h1>
          <p className="muted">Stored on this device</p>
        </div>
        {selected === "history" && items.length > 0 && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => dispatch(clearHistory())}
          >
            Clear history
          </button>
        )}
      </div>
      {selected === "subscriptions" ? (
        library.subscriptions.length ? (
          <div className="channel-grid">
            {library.subscriptions.map((channel) => (
              <a
                key={channel.id}
                className="channel-tile"
                href={paths.channel(channel.id)}
                target="_blank"
                rel="noreferrer"
              >
                <Avatar src={channel.image} name={channel.name} />
                <h2>{channel.name}</h2>
                <span>Visit channel</span>
              </a>
            ))}
          </div>
        ) : (
          <FeedbackState title="No subscriptions yet" message={config.empty} />
        )
      ) : items.length ? (
        <div className="video-grid">
          {items.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <FeedbackState
          title={`No ${selected === "saved" ? "saved" : selected === "liked" ? "liked" : "watched"} videos yet`}
          message={config.empty}
        />
      )}
    </section>
  );
}

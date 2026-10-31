import { Link } from "react-router";
import { paths } from "../../../routes/paths";
import Avatar from "../../../components/common/Avatar";
import type { Video } from "../types";
import VideoThumbnail from "./VideoThumbnail";
import VideoMetadata from "./VideoMetadata";

export default function VideoCard({
  video,
  variant = "grid",
}: {
  video: Video;
  variant?: "grid" | "search" | "compact";
}) {
  return (
    <article className={`video-card video-card-${variant}`}>
      <VideoThumbnail video={video} />
      <div className="video-card-info">
        {variant === "grid" && (
          <a
            className="channel-avatar-link"
            href={paths.channel(video.channel.id)}
            target="_blank"
            rel="noreferrer"
            aria-label={`${video.channel.name} channel`}
          >
            <Avatar src={video.channel.image} name={video.channel.name} />
          </a>
        )}
        <div className="video-card-text">
          <h2 className="video-title">
            <Link to={paths.watch(video.id)}>{video.title}</Link>
          </h2>
          {variant === "search" && (
            <VideoMetadata
              views={video.views}
              publishedAt={video.publishedAt}
            />
          )}
          <a
            className="channel-link"
            href={paths.channel(video.channel.id)}
            target="_blank"
            rel="noreferrer"
          >
            {variant === "search" && (
              <Avatar src={video.channel.image} name={video.channel.name} />
            )}
            <span>{video.channel.name}</span>
          </a>
          {variant !== "search" && (
            <VideoMetadata
              views={video.views}
              publishedAt={video.publishedAt}
            />
          )}
          {variant === "search" && (
            <p className="video-description-preview">{video.description}</p>
          )}
        </div>
      </div>
    </article>
  );
}

import { Link } from "react-router";
import { MdPlayCircleOutline } from "react-icons/md";
import { paths } from "../../../routes/paths";
import type { Video } from "../types";

export default function VideoThumbnail({ video }: { video: Video }) {
  return (
    <Link
      to={paths.watch(video.id)}
      className="video-thumbnail"
      aria-label={`Watch ${video.title}`}
    >
      {video.thumbnail ? (
        <img src={video.thumbnail} alt="" loading="lazy" />
      ) : (
        <MdPlayCircleOutline
          className="thumbnail-placeholder"
          aria-hidden="true"
        />
      )}
      <span
        className={`video-duration ${video.duration === "LIVE" ? "live-badge" : ""}`}
      >
        {video.duration}
      </span>
    </Link>
  );
}

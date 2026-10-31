import { useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";
import { HiScissors } from "react-icons/hi";
import { MdOutlinePlaylistAdd, MdPlaylistAddCheck } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import Avatar from "../../../components/common/Avatar";
import { paths } from "../../../routes/paths";
import {
  formatCount,
  formatViews,
} from "../../../utils/convertRawViewsToString";
import { timeSince } from "../../../utils/timeSince";
import { useVideoActions } from "../hooks/useVideoActions";
import type { Video } from "../types";

export default function VideoDetails({ video }: { video: Video }) {
  const [expanded, setExpanded] = useState(false);
  const actions = useVideoActions(video);
  const descriptionId = `description-${video.id}`;
  return (
    <div className="watch-details">
      <h1>{video.title}</h1>
      <div className="watch-meta-row">
        <p className="video-metadata">
          {formatViews(video.views)} views · {timeSince(video.publishedAt)}
        </p>
        <div className="video-actions" aria-label="Video actions">
          <button
            type="button"
            aria-label="Like video"
            aria-pressed={actions.liked}
            onClick={actions.toggleLike}
          >
            <BiLike />
            <span>{formatCount(video.likes)}</span>
          </button>
          <button
            type="button"
            aria-label="Dislike video"
            aria-pressed={actions.disliked}
            onClick={actions.toggleDislike}
          >
            <BiDislike />
            <span>Dislike</span>
          </button>
          <button type="button" onClick={actions.share}>
            <FaShare />
            <span>Share</span>
          </button>
          <a
            href={paths.youtube(video.id)}
            target="_blank"
            rel="noreferrer"
            title="Create a clip on YouTube"
          >
            <HiScissors />
            <span>Clip</span>
          </a>
          <button
            type="button"
            aria-pressed={actions.saved}
            onClick={actions.toggleSave}
          >
            {actions.saved ? <MdPlaylistAddCheck /> : <MdOutlinePlaylistAdd />}
            <span>{actions.saved ? "Saved" : "Save"}</span>
          </button>
          <details className="header-menu">
            <summary aria-label="More video options">
              <BsThreeDots />
            </summary>
            <div className="menu-panel">
              <a
                href={paths.youtube(video.id)}
                target="_blank"
                rel="noreferrer"
              >
                Open on YouTube
              </a>
              <a
                href={paths.channel(video.channel.id)}
                target="_blank"
                rel="noreferrer"
              >
                Visit channel
              </a>
            </div>
          </details>
        </div>
      </div>
      <p className="share-status" role="status">
        {actions.shareStatus}
      </p>
      <section className="channel-details" aria-label="Channel and description">
        <div className="channel-details-row">
          <a
            href={paths.channel(video.channel.id)}
            target="_blank"
            rel="noreferrer"
          >
            <Avatar src={video.channel.image} name={video.channel.name} />
          </a>
          <div className="channel-summary">
            <a
              href={paths.channel(video.channel.id)}
              target="_blank"
              rel="noreferrer"
            >
              {video.channel.name}
            </a>
            <p>
              {video.channel.subscribers === null
                ? "Subscribers hidden"
                : `${formatCount(video.channel.subscribers)} subscribers`}
            </p>
          </div>
          <button
            type="button"
            className={`subscribe-button ${actions.subscribed ? "subscribed" : ""}`}
            aria-pressed={actions.subscribed}
            onClick={actions.toggleSubscribe}
          >
            {actions.subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
        <p
          id={descriptionId}
          className={`watch-description ${expanded ? "expanded" : ""}`}
        >
          {video.description || "No description available."}
        </p>
        <button
          className="description-toggle"
          type="button"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((value) => !value)}
        >
          Show {expanded ? "less" : "more"}
        </button>
      </section>
    </div>
  );
}

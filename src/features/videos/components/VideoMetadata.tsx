import { formatCount } from "../../../utils/convertRawViewsToString";
import { timeSince } from "../../../utils/timeSince";

export default function VideoMetadata({
  views,
  publishedAt,
}: {
  views: string | null;
  publishedAt: string;
}) {
  return (
    <p className="video-metadata">
      <span>{formatCount(views)} views</span>
      <span aria-hidden="true"> · </span>
      <span>{timeSince(publishedAt)}</span>
    </p>
  );
}

export default function VideoPlayer({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="video-player">
      <iframe
        key={id}
        src={`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

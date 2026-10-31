import { Navigate, useSearchParams } from "react-router";
import VideoFeed from "../features/videos/components/VideoFeed";
import { usePageTitle } from "../hooks/usePageTitle";
import { paths } from "../routes/paths";

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  usePageTitle(query ? `${query} - Search` : "Search");
  return query ? (
    <VideoFeed kind="search" query={query} />
  ) : (
    <Navigate to={paths.home} replace />
  );
}

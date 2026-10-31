import VideoFeed from "../features/videos/components/VideoFeed";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle("Home");
  return <VideoFeed kind="home" query="reactjs projects" />;
}

export interface Channel {
  id: string;
  name: string;
  image: string;
  subscribers: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: string | null;
  likes: string | null;
  publishedAt: string;
  channel: Channel;
}

export interface VideoPage {
  items: Video[];
  nextPageToken: string | null;
}

export type FeedKind = "home" | "search";
export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface FeedState extends VideoPage {
  query: string;
  status: RequestStatus;
  error: string | null;
  requestId: string | null;
}

export interface ResourceState<T> {
  data: T;
  status: RequestStatus;
  error: string | null;
  requestId: string | null;
}

export interface VideosState {
  home: FeedState;
  search: FeedState;
  details: ResourceState<Video | null>;
  recommendations: ResourceState<Video[]>;
}

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../services/youtubeClient";
import {
  getChannelRecommendations,
  getVideoDetails,
  getVideoPage,
} from "./api";
import type { FeedKind, Video, VideoPage, VideosState } from "./types";

interface FeedRequest {
  kind: FeedKind;
  query: string;
  pageToken?: string;
}

interface ThunkConfig {
  state: { videos: VideosState };
  rejectValue: string;
}

const createVideoThunk = createAsyncThunk.withTypes<ThunkConfig>();

export const fetchFeed = createVideoThunk<VideoPage, FeedRequest>(
  "videos/fetchFeed",
  async ({ query, pageToken }, { signal, rejectWithValue }) => {
    try {
      return await getVideoPage(query, pageToken, signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: ({ kind, query, pageToken }, { getState }) => {
      const feed = getState().videos[kind];
      return (
        !pageToken ||
        (feed.status !== "loading" &&
          feed.query === query &&
          feed.nextPageToken === pageToken)
      );
    },
  },
);

export const fetchVideoDetails = createVideoThunk<Video, string>(
  "videos/fetchDetails",
  async (id, { signal, rejectWithValue }) => {
    try {
      return await getVideoDetails(id, signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchRecommendations = createVideoThunk<
  Video[],
  { videoId: string; channelId: string }
>(
  "videos/fetchRecommendations",
  async ({ videoId, channelId }, { signal, rejectWithValue }) => {
    try {
      return await getChannelRecommendations(videoId, channelId, signal);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

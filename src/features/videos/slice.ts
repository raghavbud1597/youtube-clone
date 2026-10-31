import { createSlice } from "@reduxjs/toolkit";
import { fetchFeed, fetchRecommendations, fetchVideoDetails } from "./actions";
import type { FeedState, Video, VideosState } from "./types";

const emptyFeed = (): FeedState => ({
  items: [],
  nextPageToken: null,
  query: "",
  status: "idle",
  error: null,
  requestId: null,
});

export const initialVideosState: VideosState = {
  home: emptyFeed(),
  search: emptyFeed(),
  details: { data: null, status: "idle", error: null, requestId: null },
  recommendations: { data: [], status: "idle", error: null, requestId: null },
};

function mergeVideos(previous: Video[], incoming: Video[]): Video[] {
  return [
    ...new Map(
      [...previous, ...incoming].map((video) => [video.id, video]),
    ).values(),
  ];
}

const videosSlice = createSlice({
  name: "videos",
  initialState: initialVideosState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, { meta }) => {
        const feed = state[meta.arg.kind];
        if (!meta.arg.pageToken) {
          feed.items = [];
          feed.nextPageToken = null;
        }
        feed.query = meta.arg.query;
        feed.status = "loading";
        feed.error = null;
        feed.requestId = meta.requestId;
      })
      .addCase(fetchFeed.fulfilled, (state, { payload, meta }) => {
        const feed = state[meta.arg.kind];
        if (feed.requestId !== meta.requestId) return;
        feed.items = meta.arg.pageToken
          ? mergeVideos(feed.items, payload.items)
          : payload.items;
        feed.nextPageToken =
          payload.nextPageToken === meta.arg.pageToken
            ? null
            : payload.nextPageToken;
        feed.status = "succeeded";
        feed.requestId = null;
      })
      .addCase(fetchFeed.rejected, (state, { payload, meta }) => {
        const feed = state[meta.arg.kind];
        if (feed.requestId !== meta.requestId) return;
        feed.status = meta.aborted ? "idle" : "failed";
        feed.error = meta.aborted
          ? null
          : (payload ?? "Couldn't load videos. Please try again.");
        feed.requestId = null;
      })
      .addCase(fetchVideoDetails.pending, (state, { meta }) => {
        state.details = {
          data: null,
          status: "loading",
          error: null,
          requestId: meta.requestId,
        };
        state.recommendations = {
          data: [],
          status: "idle",
          error: null,
          requestId: null,
        };
      })
      .addCase(fetchVideoDetails.fulfilled, (state, { payload, meta }) => {
        if (state.details.requestId !== meta.requestId) return;
        state.details = {
          data: payload,
          status: "succeeded",
          error: null,
          requestId: null,
        };
      })
      .addCase(fetchVideoDetails.rejected, (state, { payload, meta }) => {
        if (state.details.requestId !== meta.requestId) return;
        state.details = {
          data: null,
          requestId: null,
          status: meta.aborted ? "idle" : "failed",
          error: meta.aborted ? null : (payload ?? "Couldn't load this video."),
        };
      })
      .addCase(fetchRecommendations.pending, (state, { meta }) => {
        state.recommendations = {
          data: [],
          status: "loading",
          error: null,
          requestId: meta.requestId,
        };
      })
      .addCase(fetchRecommendations.fulfilled, (state, { payload, meta }) => {
        if (state.recommendations.requestId !== meta.requestId) return;
        state.recommendations = {
          data: payload,
          status: "succeeded",
          error: null,
          requestId: null,
        };
      })
      .addCase(fetchRecommendations.rejected, (state, { payload, meta }) => {
        if (state.recommendations.requestId !== meta.requestId) return;
        state.recommendations = {
          data: [],
          requestId: null,
          status: meta.aborted ? "idle" : "failed",
          error: meta.aborted
            ? null
            : (payload ?? "Couldn't load recommendations."),
        };
      });
  },
});

export default videosSlice.reducer;

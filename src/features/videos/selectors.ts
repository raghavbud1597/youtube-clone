import type { RootState } from "../../store";
import type { FeedKind } from "./types";

export const selectFeed = (state: RootState, kind: FeedKind) =>
  state.videos[kind];
export const selectVideoDetails = (state: RootState) => state.videos.details;
export const selectRecommendations = (state: RootState) =>
  state.videos.recommendations;

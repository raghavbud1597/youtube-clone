import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Channel, Video } from "../videos/types";

export interface LibraryState {
  history: Video[];
  saved: Video[];
  liked: Video[];
  dislikedIds: string[];
  subscriptions: Channel[];
}

export const initialLibraryState: LibraryState = {
  history: [],
  saved: [],
  liked: [],
  dislikedIds: [],
  subscriptions: [],
};

function toggleVideo(videos: Video[], video: Video): Video[] {
  return videos.some((item) => item.id === video.id)
    ? videos.filter((item) => item.id !== video.id)
    : [video, ...videos].slice(0, 200);
}

const librarySlice = createSlice({
  name: "library",
  initialState: initialLibraryState,
  reducers: {
    recordWatch(state, { payload }: PayloadAction<Video>) {
      state.history = [
        payload,
        ...state.history.filter((video) => video.id !== payload.id),
      ].slice(0, 100);
    },
    clearHistory(state) {
      state.history = [];
    },
    toggleSaved(state, { payload }: PayloadAction<Video>) {
      state.saved = toggleVideo(state.saved, payload);
    },
    toggleLiked(state, { payload }: PayloadAction<Video>) {
      state.liked = toggleVideo(state.liked, payload);
      state.dislikedIds = state.dislikedIds.filter((id) => id !== payload.id);
    },
    toggleDisliked(state, { payload }: PayloadAction<string>) {
      state.dislikedIds = state.dislikedIds.includes(payload)
        ? state.dislikedIds.filter((id) => id !== payload)
        : [...state.dislikedIds, payload].slice(-200);
      state.liked = state.liked.filter((video) => video.id !== payload);
    },
    toggleSubscription(state, { payload }: PayloadAction<Channel>) {
      state.subscriptions = state.subscriptions.some(
        (channel) => channel.id === payload.id,
      )
        ? state.subscriptions.filter((channel) => channel.id !== payload.id)
        : [...state.subscriptions, payload].slice(-200);
    },
  },
});

export const {
  recordWatch,
  clearHistory,
  toggleSaved,
  toggleLiked,
  toggleDisliked,
  toggleSubscription,
} = librarySlice.actions;
export default librarySlice.reducer;

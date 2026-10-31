import { beforeEach, describe, expect, it } from "vitest";
import { createAppStore } from "../../store";
import { makeVideo } from "../../test/fixtures";
import { LIBRARY_STORAGE_KEY, loadLibrary } from "./storage";
import {
  clearHistory,
  recordWatch,
  toggleDisliked,
  toggleLiked,
  toggleSaved,
} from "./slice";

beforeEach(() => localStorage.clear());

describe("local library", () => {
  it("recovers from corrupt or partially invalid saved data", () => {
    localStorage.setItem(LIBRARY_STORAGE_KEY, "invalid json");
    expect(loadLibrary().saved).toEqual([]);
    localStorage.setItem(
      LIBRARY_STORAGE_KEY,
      JSON.stringify({ saved: [makeVideo(), { id: 123 }], history: "invalid" }),
    );
    expect(loadLibrary().saved).toHaveLength(1);
    expect(loadLibrary().history).toEqual([]);
  });

  it("keeps ratings mutually exclusive and restores saved videos in a new store", () => {
    const store = createAppStore();
    const video = makeVideo();
    store.dispatch(toggleLiked(video));
    store.dispatch(toggleDisliked(video.id));
    expect(store.getState().library.liked).toEqual([]);
    store.dispatch(toggleLiked(video));
    expect(store.getState().library.dislikedIds).toEqual([]);
    store.dispatch(toggleSaved(video));
    store.dispatch(recordWatch(video));
    store.dispatch(recordWatch(video));
    expect(store.getState().library.history).toHaveLength(1);
    expect(createAppStore().getState().library.saved[0].id).toBe(video.id);
    store.dispatch(clearHistory());
    expect(loadLibrary().history).toEqual([]);
  });
});

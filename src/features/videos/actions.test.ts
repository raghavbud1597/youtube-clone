import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAppStore } from "../../store";
import { makeVideo } from "../../test/fixtures";
import { getVideoPage } from "./api";
import { fetchFeed } from "./actions";
import type { VideoPage } from "./types";
import { initialLibraryState } from "../library/slice";

vi.mock("./api", () => ({ getVideoPage: vi.fn() }));

beforeEach(() => {
  vi.mocked(getVideoPage).mockReset();
});

describe("request lifecycle and pagination", () => {
  it("ignores late results for a previous search", async () => {
    let resolveOld!: (page: VideoPage) => void;
    let resolveNew!: (page: VideoPage) => void;
    vi.mocked(getVideoPage)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveNew = resolve;
        }),
      );
    const store = createAppStore(initialLibraryState);
    const oldRequest = store.dispatch(
      fetchFeed({ kind: "search", query: "old" }),
    );
    const newRequest = store.dispatch(
      fetchFeed({ kind: "search", query: "new" }),
    );
    resolveNew({ items: [makeVideo("new")], nextPageToken: null });
    await newRequest;
    resolveOld({ items: [makeVideo("old")], nextPageToken: "old-next" });
    await oldRequest;
    expect(store.getState().videos.search).toMatchObject({
      query: "new",
      nextPageToken: null,
      items: [expect.objectContaining({ id: "new" })],
    });
  });

  it("prevents concurrent page requests, deduplicates results, and stops repeated tokens", async () => {
    let resolvePage!: (page: VideoPage) => void;
    vi.mocked(getVideoPage)
      .mockResolvedValueOnce({
        items: [makeVideo("first")],
        nextPageToken: "page-2",
      })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePage = resolve;
        }),
      );
    const store = createAppStore(initialLibraryState);
    await store.dispatch(fetchFeed({ kind: "home", query: "react" }));
    const next = store.dispatch(
      fetchFeed({ kind: "home", query: "react", pageToken: "page-2" }),
    );
    await store.dispatch(
      fetchFeed({ kind: "home", query: "react", pageToken: "page-2" }),
    );
    expect(getVideoPage).toHaveBeenCalledTimes(2);
    resolvePage({
      items: [makeVideo("first"), makeVideo("second")],
      nextPageToken: "page-2",
    });
    await next;
    expect(store.getState().videos.home.items.map((video) => video.id)).toEqual(
      ["first", "second"],
    );
    expect(store.getState().videos.home.nextPageToken).toBeNull();
  });

  it("aborts obsolete requests without surfacing an error", async () => {
    vi.mocked(getVideoPage).mockReturnValue(new Promise(() => {}));
    const store = createAppStore(initialLibraryState);
    const request = store.dispatch(fetchFeed({ kind: "search", query: "old" }));
    request.abort();
    await request;
    expect(vi.mocked(getVideoPage).mock.calls[0][2]?.aborted).toBe(true);
    expect(store.getState().videos.search).toMatchObject({
      status: "idle",
      error: null,
    });
  });
});

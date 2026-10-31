import { StrictMode } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./features/videos/api";
import { initialLibraryState } from "./features/library/slice";
import { LIBRARY_STORAGE_KEY } from "./features/library/storage";
import AppRoutes from "./routes/AppRoutes";
import { createAppStore } from "./store";
import { makeVideo } from "./test/fixtures";

vi.mock("./features/videos/api");

function renderApp(path = "/", strict = false) {
  const store = createAppStore(initialLibraryState);
  const app = (
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>
  );
  const view = render(strict ? <StrictMode>{app}</StrictMode> : app);
  return { ...view, store, user: userEvent.setup() };
}

beforeEach(() => {
  localStorage.clear();
  vi.mocked(api.getVideoPage)
    .mockReset()
    .mockResolvedValue({ items: [makeVideo()], nextPageToken: null });
  vi.mocked(api.getVideoDetails)
    .mockReset()
    .mockImplementation(async (id) => makeVideo(id));
  vi.mocked(api.getChannelRecommendations)
    .mockReset()
    .mockResolvedValue([makeVideo("recommended-1")]);
});

describe("replicated application flows", () => {
  it("renders home video cards and loads the next page without replacing existing videos", async () => {
    vi.mocked(api.getVideoPage)
      .mockResolvedValueOnce({ items: [makeVideo()], nextPageToken: "page-2" })
      .mockResolvedValueOnce({
        items: [makeVideo("video-2")],
        nextPageToken: null,
      });
    const { user } = renderApp();
    expect(
      await screen.findByRole("link", { name: "Watch Video video-1" }),
    ).toHaveAttribute("href", "/watch/video-1");
    await user.click(screen.getByRole("button", { name: "Load more videos" }));
    expect(
      await screen.findByRole("link", { name: "Watch Video video-2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Watch Video video-1" }),
    ).toBeInTheDocument();
    expect(api.getVideoPage).toHaveBeenLastCalledWith(
      "reactjs projects",
      "page-2",
      expect.any(AbortSignal),
    );
    expect(
      screen.queryByRole("button", { name: "Load more videos" }),
    ).not.toBeInTheDocument();
  });

  it("submits trimmed search text, supports repeated searches, and clears the input", async () => {
    const { user } = renderApp();
    await screen.findByRole("link", { name: "Watch Video video-1" });
    const input = screen.getByRole("searchbox", { name: "Search videos" });
    await user.type(input, "  react hooks  ");
    expect(api.getVideoPage).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(
      await screen.findByRole("heading", {
        name: "Search results for react hooks",
      }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(api.getVideoPage).toHaveBeenLastCalledWith(
        "react hooks",
        undefined,
        expect.any(AbortSignal),
      ),
    );
    const calls = vi.mocked(api.getVideoPage).mock.calls.length;
    await user.click(screen.getByRole("button", { name: "Search" }));
    await waitFor(() =>
      expect(api.getVideoPage).toHaveBeenCalledTimes(calls + 1),
    );
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("loads a search URL directly and redirects empty searches home", async () => {
    const view = renderApp("/search?q=typescript");
    await screen.findByRole("link", { name: "Watch Video video-1" });
    expect(screen.getByRole("searchbox")).toHaveValue("typescript");
    expect(api.getVideoPage).toHaveBeenLastCalledWith(
      "typescript",
      undefined,
      expect.any(AbortSignal),
    );
    view.unmount();
    renderApp("/search?q=%20%20");
    expect(
      await screen.findByRole("heading", { name: "Home" }),
    ).toBeInTheDocument();
  });

  it("opens a video, toggles the description, and navigates through channel recommendations", async () => {
    const { user, store } = renderApp();
    await user.click(
      await screen.findByRole("link", { name: "Watch Video video-1" }),
    );
    expect(await screen.findByTitle("Video video-1")).toHaveAttribute(
      "src",
      expect.stringContaining("/embed/video-1?autoplay=1"),
    );
    const toggle = screen.getByRole("button", { name: "Show more" });
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(
      await screen.findByRole("link", { name: "Watch Video recommended-1" }),
    );
    expect(await screen.findByTitle("Video recommended-1")).toBeInTheDocument();
    expect(screen.queryByTitle("Video video-1")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(store.getState().library.history.map((video) => video.id)).toEqual([
      "recommended-1",
      "video-1",
    ]);
  });

  it("persists likes, saved videos, subscriptions, and watch history on this device", async () => {
    const { user, store } = renderApp("/watch/video-1");
    await screen.findByTitle("Video video-1");
    await user.click(screen.getByRole("button", { name: "Like video" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(screen.getByRole("button", { name: "Like video" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Subscribed" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(store.getState().library.saved).toHaveLength(1);
    const persisted = JSON.parse(
      localStorage.getItem(LIBRARY_STORAGE_KEY) ?? "{}",
    );
    expect(persisted.liked[0].id).toBe("video-1");
    expect(persisted.subscriptions[0].id).toBe("channel-1");
    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    await user.click(screen.getByRole("link", { name: "Watch Later" }));
    expect(
      await screen.findByRole("heading", { name: "Watch Later" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Watch Video video-1" }),
    ).toBeInTheDocument();
  });

  it("shows a recoverable feed error and an explicit empty state", async () => {
    vi.mocked(api.getVideoPage)
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce({ items: [], nextPageToken: null });
    const { user } = renderApp();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Network unavailable",
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(
      await screen.findByRole("heading", { name: "No videos found" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows unavailable-video and recommendation failures without blank pages", async () => {
    vi.mocked(api.getVideoDetails).mockRejectedValueOnce(
      new Error("Video removed"),
    );
    vi.mocked(api.getChannelRecommendations).mockRejectedValueOnce(
      new Error("Recommendations unavailable"),
    );
    const { user } = renderApp("/watch/video-1");
    expect(await screen.findByRole("alert")).toHaveTextContent("Video removed");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByTitle("Video video-1")).toBeInTheDocument();
    const recommendations = screen.getByRole("complementary", {
      name: "Recommended videos",
    });
    expect(await within(recommendations).findByRole("alert")).toHaveTextContent(
      "Recommendations unavailable",
    );
    await user.click(
      within(recommendations).getByRole("button", { name: "Try again" }),
    );
    expect(
      await screen.findByRole("link", { name: "Watch Video recommended-1" }),
    ).toBeInTheDocument();
  });

  it("handles Strict Mode's effect cleanup without losing the loaded feed", async () => {
    renderApp("/search?q=strict+mode", true);
    expect(
      await screen.findByRole("link", { name: "Watch Video video-1" }),
    ).toBeInTheDocument();
    expect(vi.mocked(api.getVideoPage).mock.calls[0][2]?.aborted).toBe(true);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders an unknown route with a working home link", async () => {
    const { user } = renderApp("/does-not-exist");
    expect(
      await screen.findByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Go to home" }));
    expect(
      await screen.findByRole("link", { name: "Watch Video video-1" }),
    ).toBeInTheDocument();
  });
});

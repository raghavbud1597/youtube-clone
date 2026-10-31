import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { store } from "./store";

vi.mock("./utils/constants", () => ({
  YOUTUBE_API_URL: "https://youtube.googleapis.com/youtube/v3",
  YOUTUBE_API_KEY: "test-key",
}));

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("application compatibility", () => {
  it("renders the home page and loads videos with the upgraded React and Redux", async () => {
    const get = vi.spyOn(axios, "get").mockResolvedValue({
      data: { items: [] },
    });
    render(<Provider store={store}><App /></Provider>);

    expect(screen.getByRole("link", { name: "YouTube" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    await waitFor(() => expect(get).toHaveBeenCalledWith(
      "https://youtube.googleapis.com/youtube/v3/search",
      expect.objectContaining({ params: expect.objectContaining({ key: "test-key" }) })
    ));
    await waitFor(() => expect(store.getState().youtubeApp.nextPageToken).toBeNull());
  });

  it.each([
    ["/search", "Search"],
    ["/watch/example-video", "Watch"],
  ])("renders the existing route %s with React Router 8", (path, text) => {
    window.history.replaceState(null, "", path);
    render(<Provider store={store}><App /></Provider>);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});

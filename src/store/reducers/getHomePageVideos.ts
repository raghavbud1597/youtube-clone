import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "..";
import axios from "axios";
import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../../utils/constants";
import { parseData } from "../../utils";
import type { HomePageVideos } from "../../Types";

export const getHomePageVideos = createAsyncThunk(
  "youtubeApp/homePageVideos",
  async (isNext: boolean, { getState }) => {
    const {
      youtubeApp: { nextPageToken: nextPageTokenFromState, videos },
    } = getState() as RootState;
    if (!YOUTUBE_API_KEY) {
      throw new Error("Set VITE_YOUTUBE_DATA_API_KEY in your .env.local file.");
    }
    const {
      data: { items, nextPageToken },
    } = await axios.get(
      `${YOUTUBE_API_URL}/search`,
      {
        params: {
          maxResults: 20,
          q: "reactjs projects",
          key: YOUTUBE_API_KEY,
          part: "snippet",
          type: "video",
          ...(isNext && nextPageTokenFromState
            ? { pageToken: nextPageTokenFromState }
            : {}),
        },
      }
    );
    const parsedData: HomePageVideos[] = await parseData(items);
    return {
      parsedData: isNext ? [...videos, ...parsedData] : parsedData,
      nextPageToken: nextPageToken ?? null,
    };
  }
);

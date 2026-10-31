import axios from "axios";
import { YOUTUBE_API_KEY, YOUTUBE_API_URL } from "../utils/constants";

export interface ListResponse<T> {
  items?: T[];
  nextPageToken?: string;
}

interface YouTubeError {
  error?: {
    message?: string;
    errors?: { reason?: string }[];
  };
}

export async function youtubeRequest<T>(
  resource: string,
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<ListResponse<T>> {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "Add your YouTube Data API key as VITE_YOUTUBE_DATA_API_KEY in .env.local, then restart the app.",
    );
  }

  try {
    const { data } = await axios.get<ListResponse<T>>(
      `${YOUTUBE_API_URL}/${resource}`,
      {
        params: { ...params, key: YOUTUBE_API_KEY },
        signal,
        timeout: 20000,
      },
    );
    return data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    if (axios.isAxiosError<YouTubeError>(error)) {
      const reason = error.response?.data.error?.errors?.[0]?.reason;
      if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
        throw new Error(
          "YouTube's daily request limit has been reached. Please try again later.",
        );
      }
      if (reason === "keyInvalid" || reason === "accessNotConfigured") {
        throw new Error(
          "Check that your API key is valid and YouTube Data API v3 is enabled.",
        );
      }
      throw new Error(
        error.response?.data.error?.message ??
          "Couldn't connect to YouTube. Check your connection and try again.",
      );
    }
    throw error;
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { recordWatch } from "../../library/slice";
import { fetchRecommendations, fetchVideoDetails } from "../actions";
import { selectRecommendations, selectVideoDetails } from "../selectors";

export function useWatchVideo(id: string) {
  const dispatch = useAppDispatch();
  const detailsRequest = useRef<{ abort: () => void } | null>(null);
  const recommendationsRequest = useRef<{ abort: () => void } | null>(null);
  const details = useAppSelector(selectVideoDetails);
  const recommendations = useAppSelector(selectRecommendations);
  const video = details.data?.id === id ? details.data : null;

  useEffect(() => {
    if (!id) return;
    const request = dispatch(fetchVideoDetails(id));
    detailsRequest.current = request;
    return () => {
      request.abort();
      detailsRequest.current?.abort();
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!video) return;
    dispatch(recordWatch(video));
    const request = dispatch(
      fetchRecommendations({ videoId: video.id, channelId: video.channel.id }),
    );
    recommendationsRequest.current = request;
    return () => {
      request.abort();
      recommendationsRequest.current?.abort();
    };
  }, [dispatch, video]);

  const retry = useCallback(() => {
    detailsRequest.current = dispatch(fetchVideoDetails(id));
  }, [dispatch, id]);
  const retryRecommendations = useCallback(() => {
    if (video)
      recommendationsRequest.current = dispatch(
        fetchRecommendations({
          videoId: video.id,
          channelId: video.channel.id,
        }),
      );
  }, [dispatch, video]);

  return {
    video,
    status: details.status,
    error: details.error,
    recommendations,
    retry,
    retryRecommendations,
  };
}

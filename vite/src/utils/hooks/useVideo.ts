import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { useRef, useEffect, useReducer } from "react";
import { isNullable } from "../isNonNullable";

type VideoReducerState = {
  player: VideoJsPlayer | null;
  ref: React.RefObject<HTMLVideoElement>;
};
enum VideoReducerActionType {
  INITIALIZE = "INITIALIZE",
}
type VideoReducerAction = {
  type: VideoReducerActionType.INITIALIZE;
  src: string;
  readyCallback?: videojs.ReadyCallback;
};
type VideoReducer = (
  state: VideoReducerState,
  action: VideoReducerAction
) => VideoReducerState;

interface InitializeVideoPlayer {
  src: string;
  videoElement: HTMLVideoElement;
  readyCallback?: videojs.ReadyCallback;
}

function initializeVideoPlayer({
  src,
  videoElement,
  readyCallback,
}: InitializeVideoPlayer) {
  const options: VideoJsPlayerOptions = {
    autoplay: true,
    controls: true,
    // responsive: true,
    fluid: true,
    sources: [{ type: "video/mp4", src }],
  };

  return videojs(videoElement, options, readyCallback);
}

const INITIALIZE = VideoReducerActionType.INITIALIZE;

function videoReducer(state: VideoReducerState, action: VideoReducerAction) {
  const { src, readyCallback } = action;
  const videoElement = state.ref.current;

  switch (action.type) {
    case INITIALIZE:
      if (isNullable(src) || isNullable(videoElement)) return state;
      return {
        ...state,
        player: initializeVideoPlayer({ src, videoElement, readyCallback }),
      };
  }
}

export default function useVideo(
  src: string,
  readyCallback?: videojs.ReadyCallback
) {
  const ref = useRef<HTMLVideoElement>(null);

  const [video, dispatch] = useReducer<VideoReducer>(videoReducer, {
    ref,
    player: null,
  });

  useEffect(() => {
    // make sure Video.js player is only initialized once when there's a video element
    if (video.player) return;

    dispatch({ type: INITIALIZE, src, readyCallback });
  }, [readyCallback, src, video.player]);

  return { ref };
}

import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { useRef, useEffect, useReducer } from "react";

type VideoReducerState = { player: VideoJsPlayer | null };
enum VideoReducerActionType {
  INITIALIZE = "INITIALIZE",
}
type VideoReducerAction = { type: VideoReducerActionType };
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

export default function useVideo(
  src: string,
  readyCallback?: videojs.ReadyCallback
) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, dispatch] = useReducer<VideoReducer>(
    (state, { type }) => {
      const videoElement = videoRef.current;

      switch (type) {
        case VideoReducerActionType.INITIALIZE:
          if (!videoElement) return state;
          return {
            player: initializeVideoPlayer({ src, videoElement, readyCallback }),
          };
        default:
          throw new Error("Unknown action type");
      }
    },
    { player: null }
  );

  useEffect(() => {
    // make sure Video.js player is only initialized once when there's a video element
    if (video.player) return;

    dispatch({ type: VideoReducerActionType.INITIALIZE });
  }, [video.player]);

  return { video, videoRef };
}

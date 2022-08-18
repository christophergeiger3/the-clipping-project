import "video.js/dist/video-js.css";
import { useRef, useEffect, useReducer } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { Grid } from "@mui/material";

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

function useVideo(src: string, readyCallback?: videojs.ReadyCallback) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, dispatchVideo] = useReducer<VideoReducer>(
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

    dispatchVideo({ type: VideoReducerActionType.INITIALIZE });
  }, [video.player]);

  return { video, videoRef };
}

export default function VideoPlayer({
  src,
  onVideoPlayerReady,
}: {
  src: string;
  onVideoPlayerReady?: videojs.ReadyCallback;
}) {
  const { videoRef } = useVideo(src, onVideoPlayerReady);

  return (
    <Grid container={true}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
    </Grid>
  );
}

import "video.js/dist/video-js.css";
import { useRef, useEffect, useReducer } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import { Grid } from "@mui/material";

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

type VideoReducerState = {
  player: VideoJsPlayer | null;
};
type VideoReducerAction = { type: "INITIALIZE" } | { type: "DESTROY" };
type VideoReducer = (
  state: VideoReducerState,
  action: VideoReducerAction
) => VideoReducerState;

export default function VideoPlayer({
  src,
  startEndTimes,
}: {
  src: string;
  startEndTimes?: [number, number];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, dispatchVideo] = useReducer<VideoReducer>(
    (state, { type }) => {
      const videoElement = videoRef.current;

      switch (type) {
        case "INITIALIZE":
          if (!videoElement) return state;
          return {
            player: initializeVideoPlayer({ src, videoElement }),
          };
        default:
          throw new Error("Unknown action type");
      }
    },
    { player: null }
  );

  useEffect(() => {
    // make sure Video.js player is only initialized once when there's a video element
    if (video.player || !videoRef.current) return;

    dispatchVideo({ type: "INITIALIZE" });
  }, [video.player, videoRef.current]);

  return (
    <Grid>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
    </Grid>
  );
}

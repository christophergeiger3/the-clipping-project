import "video.js/dist/video-js.css";
import { Grid } from "@mui/material";
import useVideo from "../../utils/hooks/useVideo";
import { useClipContext } from "../../providers/ClipProvider";

export default function VideoPlayer({ src }: { src: string }) {
  const { handleVideoPlayerReady } = useClipContext();
  const { videoRef } = useVideo(src, handleVideoPlayerReady);

  return (
    <Grid container={true}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
    </Grid>
  );
}

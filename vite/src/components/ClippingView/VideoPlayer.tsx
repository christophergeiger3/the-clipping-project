import "video.js/dist/video-js.css";
import { Grid } from "@mui/material";
import useVideo from "../../utils/hooks/useVideo";

export default function VideoPlayer({ src }: { src: string }) {
  const { videoRef } = useVideo(src);

  return (
    <Grid container={true}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
    </Grid>
  );
}

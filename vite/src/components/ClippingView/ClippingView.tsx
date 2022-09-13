import { Grid } from "@mui/material";
import { useClipState } from "@providers/ClipProvider";
import isNonNullable from "@utils/isNonNullable";
import { DEFAULT_CLIP_STATE } from "@reducers/clipReducer";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";
import {
  ZoomInButton,
  ZoomResetButton,
} from "./ClippingControls/ClipButtons/ZoomButton";

export default function ClippingView() {
  const { start, end, duration } = useClipState();

  const showClipStartEndTimesSlider =
    isNonNullable(start) && isNonNullable(end) && isNonNullable(duration);

  const clipSlider = showClipStartEndTimesSlider ? (
    <ClipStartEndTimesSlider />
  ) : null;

  const zoomButtons = showClipStartEndTimesSlider ? (
    <Grid container={true} spacing={2}>
      <ZoomInButton />
      <ZoomResetButton />
    </Grid>
  ) : null;

  return (
    <Grid container={true} columns={100} mt={2} mb={2}>
      <Grid item={true} xs={1} md={5} xl={10} />
      <Grid item={true} xs={98} md={90} xl={80}>
        <VideoPlayer src={DEFAULT_CLIP_STATE.src} />
        {clipSlider}
        {zoomButtons}
        <VideoControlPanel />
        <ClippingControlPanel />
        <ViewAllClipsButton />
      </Grid>
      <Grid item={true} xs={1} md={5} xl={10} />
    </Grid>
  );
}

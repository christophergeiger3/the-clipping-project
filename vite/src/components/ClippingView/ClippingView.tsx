import { Grid } from "@mui/material";
import { useClipContext } from "../../providers/ClipProvider";
import isNonNullable from "../../utils/isNonNullable";
import { DEFAULT_CLIP_STATE } from "../../utils/reducers/clipReducer";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

export default function ClippingView() {
  const {
    state: { start, end, duration },
  } = useClipContext();

  const showClipStartEndTimesSlider =
    isNonNullable(start) && isNonNullable(end) && isNonNullable(duration);

  const clipSlider = showClipStartEndTimesSlider ? (
    <ClipStartEndTimesSlider />
  ) : null;

  return (
    <Grid container={true} columns={100} pt={2}>
      <Grid item={true} xs={1} md={5} xl={10} />
      <Grid item={true} xs={98} md={90} xl={80}>
        {/* fix me! (src) */}
        <VideoPlayer src={DEFAULT_CLIP_STATE.src} />
        {clipSlider}
        <VideoControlPanel />
        <ClippingControlPanel />
        <ViewAllClipsButton />
      </Grid>
      <Grid item={true} xs={1} md={5} xl={10} />
    </Grid>
  );
}

import { Grid } from "@mui/material";
import { useCallback, useReducer } from "react";
import videojs from "video.js";
import isNonNullable from "../../utils/isNonNullable";
import {
  ActionType,
  clipReducer,
  DEFAULT_CLIP_STATE,
} from "../../utils/reducers/ClipReducer";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

export default function ClippingView() {
  const [{ start, end, duration, src }, dispatch] = useReducer(
    clipReducer,
    DEFAULT_CLIP_STATE
  );

  const onLoadedMetadata = useCallback(function (this: videojs.Player) {
    dispatch({ type: ActionType.PLAYER_READY, player: this });
  }, []);

  const onTimeUpdate = useCallback(function (this: videojs.Player) {
    dispatch({
      type: ActionType.PLAYER_TIME_UPDATE,
      player: this,
    });
  }, []);

  const handleVideoPlayerReady = useCallback<videojs.ReadyCallback>(
    function (this: videojs.Player) {
      this.on("loadedmetadata", onLoadedMetadata);
      this.on("timeupdate", onTimeUpdate);
    },
    [onLoadedMetadata, onTimeUpdate]
  );

  const showClipStartEndTimesSlider =
    isNonNullable(start) && isNonNullable(end) && isNonNullable(duration);

  const clipSlider = showClipStartEndTimesSlider ? (
    <ClipStartEndTimesSlider
      start={start}
      end={end}
      duration={duration}
      dispatch={dispatch}
    />
  ) : null;

  return (
    <Grid container={true} columns={100} pt={2}>
      <Grid item={true} xs={1} md={5} xl={10} />
      <Grid item={true} xs={98} md={90} xl={80}>
        <VideoPlayer src={src} onVideoPlayerReady={handleVideoPlayerReady} />
        {clipSlider}
        <VideoControlPanel dispatch={dispatch} />
        <ClippingControlPanel />
        <ViewAllClipsButton />
      </Grid>
      <Grid item={true} xs={1} md={5} xl={10} />
    </Grid>
  );
}

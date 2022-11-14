import { Grid } from "@mui/material";
import { useClipState } from "@providers/ClipProvider";
import isNonNullable from "@utils/isNonNullable";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";
import {
  ZoomInButton,
  ZoomResetButton,
} from "./ClippingControls/ClipButtons/ZoomButton";
import { useCallback, useState } from "react";
import { SettingsButton } from "./ClippingControls/ClipButtons/SettingsButton";
import Settings from "./Settings";

export default function ClippingView() {
  const { src, start, end, duration } = useClipState();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const showClipStartEndTimesSlider =
    isNonNullable(start) && isNonNullable(end) && isNonNullable(duration);

  const ClipSlider = useCallback(
    () => (showClipStartEndTimesSlider ? <ClipStartEndTimesSlider /> : null),
    [showClipStartEndTimesSlider]
  );

  const PlayerButtons = useCallback(
    () =>
      showClipStartEndTimesSlider ? (
        <Grid container={true} spacing={2}>
          <ZoomInButton />
          <ZoomResetButton />
          <SettingsButton onClick={handleToggleSettings} />
        </Grid>
      ) : null,
    [handleToggleSettings, showClipStartEndTimesSlider]
  );

  return (
    <Grid container={true} columns={100} mt={2} mb={2}>
      <Grid item={true} xs={2} md={5} xl={10} />
      <Grid item={true} xs={96} md={90} xl={80}>
        <VideoPlayer src={src} />
        <ClipSlider />
        <PlayerButtons />
        <Settings open={isSettingsOpen} />
        <VideoControlPanel />
        <ClippingControlPanel />
        <ViewAllClipsButton />
      </Grid>
      <Grid item={true} xs={2} md={5} xl={10} />
    </Grid>
  );
}

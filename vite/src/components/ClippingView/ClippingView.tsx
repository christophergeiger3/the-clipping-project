import { useCallback, useState } from "react";
import videojs from "video.js";
import { toMilliseconds } from "../../utils/timestamp";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider, {
  ClipStartEndTimes,
} from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export default function ClippingView() {
  const [src, _setSrc] = useState(DEFAULT_VIDEO_SRC);
  const [clipDuration, setClipDuration] = useState<number>();
  const [clipStartEndTimes, setClipStartEnd] = useState<ClipStartEndTimes>();
  const [clipStart, clipEnd] = clipStartEndTimes || [undefined, undefined];

  const handleVideoPlayerReady = useCallback<videojs.ReadyCallback>(function (
    this: videojs.Player
  ) {
    this.on("loadedmetadata", () => {
      const duration = toMilliseconds(this.duration());
      setClipDuration(() => duration);
      setClipStartEnd([0, duration]);
    });
  },
  []);

  const showClipStartEndTimesSlider =
    isNonNullable(clipStart) &&
    isNonNullable(clipEnd) &&
    isNonNullable(clipDuration);

  return (
    <>
      <VideoPlayer src={src} onVideoPlayerReady={handleVideoPlayerReady} />
      {showClipStartEndTimesSlider ? (
        <ClipStartEndTimesSlider
          start={clipStart}
          end={clipEnd}
          duration={clipDuration}
          onUpdateStartEndTimes={setClipStartEnd}
        />
      ) : null}
      <VideoControlPanel />
      <ClippingControlPanel />
      <ViewAllClipsButton />
    </>
  );
}

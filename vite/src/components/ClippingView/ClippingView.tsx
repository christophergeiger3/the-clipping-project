import { useCallback, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function ClippingView() {
  const [src, _setSrc] = useState(DEFAULT_VIDEO_SRC);
  const [clipDuration, setClipDuration] = useState<number>(100);
  const [[clipStart, clipEnd], setClipStartEnd] = useState([0, clipDuration]);

  const onVideoPlayerReady = useCallback<videojs.ReadyCallback>(function (
    this: videojs.Player
  ) {
    this.on("loadedmetadata", () => {
      const duration = this.duration();
      setClipDuration(() => duration);
      setClipStartEnd([0, duration]);
    });
  },
  []);

  return (
    <>
      <VideoPlayer src={src} readyCallback={onVideoPlayerReady} />
      <ClipStartEndTimesSlider
        start={clipStart}
        end={clipEnd}
        duration={clipDuration}
        onUpdateStartEndTimes={setClipStartEnd}
      />
      <VideoControlPanel />
      <ClippingControlPanel />
      <ViewAllClipsButton />
    </>
  );
}

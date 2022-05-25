import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import "video.js/dist/video-js.css";
import { Grid, Slider } from "@mui/material";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";
import VideoControlPanel from "./VideoControlPanel";

export const MIN_CLIP_DURATION = 1000;

export default function Video({
  src,
  startEndTimes,
  onUpdateStartEndTimes,
}: {
  src: string;
  startEndTimes: number[];
  onUpdateStartEndTimes: (startEndTimes: number[]) => void;
}) {
  const videoRef = useRef(null);
  const playerRef = useRef<null | VideoJsPlayer>(null);
  const [duration, setDuration] = useState<number>();
  const startEndRef = useRef<number[]>(startEndTimes);
  const setStartEndTimes = useCallback(
    ([start, end]: number[]) => {
      startEndRef.current = [start, end];
      onUpdateStartEndTimes([start, end]);
    },
    [onUpdateStartEndTimes]
  );

  const localWillSeekOnSliderUpdate: boolean | null = JSON.parse(
    localStorage.getItem("willSeekOnSliderUpdate") || "null"
  );
  const [willSeekOnSliderUpdate, setWillSeekOnSliderUpdate] = useState(
    !!(localWillSeekOnSliderUpdate === null || localWillSeekOnSliderUpdate)
  );
  const localIsPreciseToMilliseconds: boolean | null = JSON.parse(
    localStorage.getItem("isPreciseToMilliseconds") || "null"
  );
  const [isPreciseToMilliseconds, setIsPreciseToMilliseconds] = useState(
    !!localIsPreciseToMilliseconds
  );

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      if (name === "willSeekOnSliderUpdate") {
        setWillSeekOnSliderUpdate(checked);
      } else if (name === "isPreciseToMilliseconds") {
        setIsPreciseToMilliseconds(checked);
      }
      localStorage.setItem(name, JSON.stringify(checked));
    },
    [setWillSeekOnSliderUpdate, setIsPreciseToMilliseconds]
  );

  const convertNumberToTimestamp = useMemo(
    () => (timestamp: number) => {
      return convertMillisecondsToTimestamp(timestamp, isPreciseToMilliseconds);
    },
    [isPreciseToMilliseconds]
  );

  const options = useMemo(() => {
    return {
      autoplay: true,
      controls: true,
      // responsive: true,
      fluid: true,
      sources: [{ type: "video/mp4", src }],
    };
  }, [src]);

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        player.on("loadedmetadata", () => {
          console.log("loadedmetadata");
          const d = Math.floor(player.duration() * 1000);
          setDuration(d);
          setStartEndTimes([0, d]);
        });
      }));
    } else {
    }
  }, [options, playerRef, videoRef, duration, setStartEndTimes, startEndTimes]);

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      player.on("timeupdate", () => {
        const currentTime = player.currentTime() * 1000;
        const [start, end] = startEndRef.current;
        if (currentTime > end) {
          player.pause();
          player.currentTime(end / 1000);
        } else if (currentTime < start) {
          player.pause();
          player.currentTime(start / 1000);
        }
      });
    }
  }, [startEndTimes]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      // https://github.com/videojs/video.js/issues/5606#issuecomment-440142607
      player.src({ src, type: "video/mp4" });
    }
  }, [playerRef, src]);

  const handleSliderChange = useCallback(
    (
      _event: Event | React.SyntheticEvent<Element, Event>,
      newStartEndTimes: number | number[],
      activeThumb: number
    ) => {
      if (!Array.isArray(newStartEndTimes)) {
        return;
      }

      const player = playerRef.current;

      if (activeThumb === 0) {
        setStartEndTimes([
          Math.min(newStartEndTimes[0], startEndTimes[1] - MIN_CLIP_DURATION),
          startEndTimes[1],
        ]);
        if (player && willSeekOnSliderUpdate) {
          player.currentTime(newStartEndTimes[0] / 1000);
        }
      } else {
        setStartEndTimes([
          startEndTimes[0],
          Math.max(newStartEndTimes[1], startEndTimes[0] + MIN_CLIP_DURATION),
        ]);
        if (player && willSeekOnSliderUpdate) {
          player.currentTime(newStartEndTimes[1] / 1000);
        }
      }
    },
    [setStartEndTimes, startEndTimes, playerRef, willSeekOnSliderUpdate]
  );

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <Grid>
      <Grid container={true} pt={2} direction="column">
        <div data-vjs-player>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
        {duration ? (
          <Slider
            getAriaLabel={() => "Video range"}
            value={startEndTimes}
            onChange={handleSliderChange}
            min={0}
            max={duration}
            valueLabelFormat={convertNumberToTimestamp}
            valueLabelDisplay="auto"
          />
        ) : null}
        <VideoControlPanel
          playerRef={playerRef}
          startEndRef={startEndRef}
          setStartEndTimes={setStartEndTimes}
          duration={duration}
          onCheckboxChange={handleCheckboxChange}
          willSeekOnSliderUpdate={willSeekOnSliderUpdate}
          isPreciseToMilliseconds={isPreciseToMilliseconds}
        />
      </Grid>
    </Grid>
  );
}

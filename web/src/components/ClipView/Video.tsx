import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import "video.js/dist/video-js.css";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Slider,
  Typography,
} from "@mui/material";
import { SkipNext, SkipPrevious } from "@mui/icons-material";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";

const MIN_CLIP_DURATION = 1000;

// TODO: Slider stop does not precisely match the end of the clip
// TODO: Add toggle to enable clip looping at clip end
// TODO: (backend) clip output value is videos/outputfilename.mp4 but should be outputfilename.mp4
// TODO: on /clips endpoint the analyzed URL sometimes appears, not the pre-analysis URL
// TODO: (backend) rename url in clip schema
// TODO: Swap -1sec and +1sec toggles to -100ms and +100ms when preciseToMilliseconds is true
// TODO: Swap slider to use seconds instead of milliseconds when preciseToMilliseconds is false (lower granularity)
// TODO: Rework styling of "Left:" and "Right:" labels
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
    ([start, end]) => {
      startEndRef.current = [start, end];
      onUpdateStartEndTimes([start, end]);
    },
    [onUpdateStartEndTimes]
  );

  const [willSeekOnSliderUpdate, setWillSeekOnSliderUpdate] = useState(true);
  const [isPreciseToMilliseconds, setIsPreciseToMilliseconds] = useState(false);

  const handleWillSeekOnSliderUpdateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWillSeekOnSliderUpdate(event.target.checked);
    },
    []
  );

  const handleIsPreciseToMillisecondsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsPreciseToMilliseconds(event.target.checked);
    },
    []
  );

  const handleIncrementStart = useCallback(() => {
    const [start, end] = startEndRef.current;
    setStartEndTimes([Math.max(0, start + MIN_CLIP_DURATION), end]);
  }, [setStartEndTimes]);

  const handleDecrementStart = useCallback(() => {
    const [start, end] = startEndRef.current;
    setStartEndTimes([Math.max(0, start - MIN_CLIP_DURATION), end]);
  }, [setStartEndTimes]);

  const handleIncrementEnd = useCallback(() => {
    const [start, end] = startEndRef.current;
    setStartEndTimes([
      start,
      Math.min(end + MIN_CLIP_DURATION, duration || end + MIN_CLIP_DURATION),
    ]);
  }, [setStartEndTimes, duration]);

  const handleDecrementEnd = useCallback(() => {
    const [start, end] = startEndRef.current;
    setStartEndTimes([
      start,
      Math.min(end - MIN_CLIP_DURATION, duration || end - MIN_CLIP_DURATION),
    ]);
  }, [setStartEndTimes, duration]);

  const handleJumpToClipStart = useCallback(() => {
    const [start] = startEndRef.current;
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime(start / 1000);
  }, []);

  const handleJumpToClipEnd = useCallback(() => {
    const [, end] = startEndRef.current;
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime(end / 1000);
  }, []);

  const handleSetStartToCurrentTime = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const currentTime = Math.floor(player.currentTime() * 1000);
    setStartEndTimes([currentTime, startEndRef.current[1]]);
  }, [setStartEndTimes]);

  const handleSetEndToCurrentTime = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const currentTime = Math.floor(player.currentTime() * 1000);
    setStartEndTimes([startEndRef.current[0], currentTime]);
  }, [setStartEndTimes]);

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
      sources: [{ type: "video/mp4", src }], // TODO: fix me, types hack
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
          const d = Math.floor(player.duration() * 1000); // TODO: Remove floor and use milliseconds
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
    <>
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
        <Grid pb={2} container={true}>
          <FormControlLabel
            label="Seek on slider movement"
            control={
              <Checkbox
                checked={willSeekOnSliderUpdate}
                onChange={handleWillSeekOnSliderUpdateChange}
              />
            }
          />
          <FormControlLabel
            label="Precise to milliseconds"
            control={
              <Checkbox
                checked={isPreciseToMilliseconds}
                onChange={handleIsPreciseToMillisecondsChange}
              />
            }
          />
        </Grid>
        <Grid pb={2} container={true}>
          <Typography sx={{ marginRight: 1 }}>Left: </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleJumpToClipStart}
            startIcon={<SkipPrevious />}
            sx={{ marginRight: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleDecrementStart}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            -{MIN_CLIP_DURATION / 1000} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementStart}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            +{MIN_CLIP_DURATION / 1000} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleSetStartToCurrentTime}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {`Set to current time`}
          </Button>
          <Typography sx={{ marginRight: 1 }}>Right: </Typography>
          <Button
            variant="contained"
            onClick={handleJumpToClipEnd}
            color="primary"
            startIcon={<SkipNext />}
            sx={{ marginRight: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleDecrementEnd}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            -{MIN_CLIP_DURATION / 1000} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementEnd}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            +{MIN_CLIP_DURATION / 1000} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleSetEndToCurrentTime}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {`Set to current time`}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

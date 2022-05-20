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

const MIN_CLIP_DURATION = 1;

function convertSecondsToTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

// TODO: Change skip buttons to control playback seeking, not slider controls
// TODO: Slider stop does not precisely match the end of the clip
// TODO: Add toggle to enable clip looping at clip end
// TODO: (backend) clip output value is videos/outputfilename.mp4 but should be outputfilename.mp4
// TODO: on /clips endpoint the analyzed URL sometimes appears, not the pre-analysis URL
// TODO: (backend) rename url in clip schema
// TODO: Add more granular seeking control for milliseconds
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

  const handleWillSeekOnSliderUpdateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWillSeekOnSliderUpdate(event.target.checked);
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
    playerRef.current.currentTime(start);
  }, []);

  const handleJumpToClipEnd = useCallback(() => {
    const [, end] = startEndRef.current;
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime(end);
  }, []);

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
          const d = Math.floor(player.duration()); // TODO: Remove floor and use milliseconds
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
        const currentTime = player.currentTime();
        const [start, end] = startEndRef.current;
        if (currentTime > end) {
          player.pause();
          player.currentTime(end);
        } else if (currentTime < start) {
          player.pause();
          player.currentTime(start);
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
          player.currentTime(newStartEndTimes[0]);
        }
      } else {
        setStartEndTimes([
          startEndTimes[0],
          Math.max(newStartEndTimes[1], startEndTimes[0] + MIN_CLIP_DURATION),
        ]);
        if (player && willSeekOnSliderUpdate) {
          player.currentTime(newStartEndTimes[1]);
        }
      }

      // if (startEndTimes && player) {
      //   const [startTime, endTime] = startEndTimes;
      //   const currentTime = player.currentTime();
      //   if (currentTime > endTime) {
      //     player.pause();
      //     player.currentTime(endTime);
      //   }
      //   if (currentTime < startTime) {
      //     player.pause();
      //     player.currentTime(startTime);
      //   }
      // }
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
            valueLabelFormat={convertSecondsToTimestamp}
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
            -{MIN_CLIP_DURATION} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementStart}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            +{MIN_CLIP_DURATION} sec
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
            -{MIN_CLIP_DURATION} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementEnd}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            +{MIN_CLIP_DURATION} sec
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

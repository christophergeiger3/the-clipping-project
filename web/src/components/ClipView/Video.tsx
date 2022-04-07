import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import "video.js/dist/video-js.css";
import { Button, Grid, Slider, Typography } from "@mui/material";

const MIN_CLIP_DURATION = 1;

function convertSecondsToTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

// TODO:
// ** display milliseconds as timestamps
// button to seek to end of clip
// button to seek to start of clip
// button to jump forward x seconds
// play/pause button
// form to seek to a specific time
// loop video to start on end
// loading indicator while post request is loading
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
    // const options = {
    //   autoplay: true,
    //   controls: true,
    //   responsive: true,
    //   fluid: true,
    //   sources: [{ type: "video/mp4", src }], // TODO: fix me, types hack
    // };

    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = (playerRef.current = videojs(videoElement, options, () => {
        console.log("player is ready");
        player.on("loadedmetadata", () => {
          console.log("loadedmetadata");
          const d = player.duration();
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
        // setStartEndTimes(newStartEndTimes as number[]);
        setStartEndTimes([
          Math.min(newStartEndTimes[0], startEndTimes[1] - MIN_CLIP_DURATION),
          startEndTimes[1],
        ]);
      } else {
        // setStartEndTimes([start, Math.max(end + MIN_DURATION)]);
        setStartEndTimes([
          startEndTimes[0],
          Math.max(newStartEndTimes[1], startEndTimes[0] + MIN_CLIP_DURATION),
        ]);
      }

      if (startEndTimes && player) {
        const [startTime, endTime] = startEndTimes;
        const currentTime = player.currentTime();
        if (currentTime > endTime) {
          player.pause();
          player.currentTime(endTime);
        }
        if (currentTime < startTime) {
          player.pause();
          player.currentTime(startTime);
        }
      }
    },
    [setStartEndTimes, startEndTimes, playerRef]
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
          <Typography>Left: </Typography>
          <Button
            variant="contained"
            onClick={handleDecrementStart}
            color="primary"
          >
            -{MIN_CLIP_DURATION} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementStart}
            color="primary"
          >
            +{MIN_CLIP_DURATION} sec
          </Button>
          <Typography>Right: </Typography>
          <Button
            variant="contained"
            onClick={handleDecrementEnd}
            color="primary"
          >
            -{MIN_CLIP_DURATION} sec
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementEnd}
            color="primary"
          >
            +{MIN_CLIP_DURATION} sec
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

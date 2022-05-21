import { SkipNext, SkipPrevious } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { VideoJsPlayer } from "video.js";
import { MIN_CLIP_DURATION } from "./Video";

interface VideoControlPanelProps {
  playerRef: React.MutableRefObject<VideoJsPlayer | null>;
  startEndRef: React.MutableRefObject<number[]>;
  setStartEndTimes: (startEndTimes: [number, number]) => void;
  duration: number | undefined;
  //   onSliderChange: ([start, end]: [number, number]) => void;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  willSeekOnSliderUpdate: boolean;
  isPreciseToMilliseconds: boolean;
}

export default function VideoControlPanel({
  playerRef,
  startEndRef,
  setStartEndTimes,
  duration,
  //   onSliderChange,
  onCheckboxChange,
  willSeekOnSliderUpdate,
  isPreciseToMilliseconds,
}: VideoControlPanelProps) {
  const handleAddToStart = useCallback(
    (amount: number) => {
      const [start, end] = startEndRef.current;
      setStartEndTimes([Math.max(0, start + amount), end]);
    },
    [startEndRef, setStartEndTimes]
  );

  const handleAddToEnd = useCallback(
    (amount: number) => {
      const [start, end] = startEndRef.current;
      setStartEndTimes([
        start,
        Math.min(end + amount, duration || end + amount),
      ]);
    },
    [startEndRef, setStartEndTimes, duration]
  );

  const handleSetStartToCurrentTime = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const currentTime = Math.floor(player.currentTime() * 1000);
    setStartEndTimes([currentTime, startEndRef.current[1]]);
  }, [playerRef, startEndRef, setStartEndTimes]);

  const handleSetEndToCurrentTime = useCallback(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    const currentTime = Math.floor(player.currentTime() * 1000);
    setStartEndTimes([startEndRef.current[0], currentTime]);
  }, [playerRef, startEndRef, setStartEndTimes]);

  const handleJumpToClipStart = useCallback(() => {
    const [start] = startEndRef.current;
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime(start / 1000);
  }, [playerRef, startEndRef]);

  const handleJumpToClipEnd = useCallback(() => {
    const [, end] = startEndRef.current;
    if (!playerRef.current) {
      return;
    }
    playerRef.current.currentTime(end / 1000);
  }, [playerRef, startEndRef]);

  const handleIncrementStartByMinimum = useCallback(() => {
    handleAddToStart(MIN_CLIP_DURATION);
  }, [handleAddToStart]);

  const handleDecrementStartByMinimum = useCallback(() => {
    handleAddToStart(-MIN_CLIP_DURATION);
  }, [handleAddToStart]);

  const handleIncrementEndByMinimum = useCallback(() => {
    handleAddToEnd(MIN_CLIP_DURATION);
  }, [handleAddToEnd]);

  const handleDecrementEndByMinimum = useCallback(() => {
    handleAddToEnd(-MIN_CLIP_DURATION);
  }, [handleAddToEnd]);

  return (
    <>
      <Grid pb={2} container={true}>
        <FormControlLabel
          label="Seek on slider movement"
          control={
            <Checkbox
              name="willSeekOnSliderUpdate"
              checked={willSeekOnSliderUpdate}
              onChange={onCheckboxChange}
            />
          }
        />
        <FormControlLabel
          label="Precise to milliseconds"
          control={
            <Checkbox
              name="isPreciseToMilliseconds"
              checked={isPreciseToMilliseconds}
              onChange={onCheckboxChange}
            />
          }
        />
      </Grid>
      <Grid pb={2} container={true}>
        <Typography sx={{ marginRight: 1 }}>Left: </Typography>
        <Button
          name="jumpToClipStart"
          variant="contained"
          color="primary"
          onClick={handleJumpToClipStart}
          startIcon={<SkipPrevious />}
          sx={{ marginRight: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleDecrementStartByMinimum}
          color="primary"
          sx={{ marginRight: 1 }}
        >
          -{MIN_CLIP_DURATION / 1000} sec
        </Button>
        <Button
          variant="contained"
          onClick={handleIncrementStartByMinimum}
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
          onClick={handleDecrementEndByMinimum}
          color="primary"
          sx={{ marginRight: 1 }}
        >
          -{MIN_CLIP_DURATION / 1000} sec
        </Button>
        <Button
          variant="contained"
          onClick={handleIncrementEndByMinimum}
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
    </>
  );
}

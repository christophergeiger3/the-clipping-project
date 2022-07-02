import { SkipNext, SkipPrevious } from "@mui/icons-material";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { VideoJsPlayer } from "video.js";

const CLIP_INCREMENT_AMOUNT_LOW_PRECISION = 1000;
const CLIP_INCREMENT_AMOUNT_HIGH_PRECISION = 100;

interface VideoControlPanelProps {
  playerRef: React.MutableRefObject<VideoJsPlayer | null>;
  startEndRef: React.MutableRefObject<number[]>;
  setStartEndTimes: (startEndTimes: [number, number]) => void;
  duration: number | undefined;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  willSeekOnSliderUpdate: boolean;
  isPreciseToMilliseconds: boolean;
  showStartEndTextFields: boolean;
}

export default function VideoControlPanel({
  playerRef,
  startEndRef,
  setStartEndTimes,
  duration,
  onCheckboxChange,
  willSeekOnSliderUpdate,
  isPreciseToMilliseconds,
  showStartEndTextFields,
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
    if (isPreciseToMilliseconds) {
      handleAddToStart(CLIP_INCREMENT_AMOUNT_HIGH_PRECISION);
    } else {
      handleAddToStart(CLIP_INCREMENT_AMOUNT_LOW_PRECISION);
    }
  }, [isPreciseToMilliseconds, handleAddToStart]);

  const handleDecrementStartByMinimum = useCallback(() => {
    if (isPreciseToMilliseconds) {
      handleAddToStart(-CLIP_INCREMENT_AMOUNT_HIGH_PRECISION);
    } else {
      handleAddToStart(-CLIP_INCREMENT_AMOUNT_LOW_PRECISION);
    }
  }, [isPreciseToMilliseconds, handleAddToStart]);

  const handleIncrementEndByMinimum = useCallback(() => {
    if (isPreciseToMilliseconds) {
      handleAddToEnd(CLIP_INCREMENT_AMOUNT_HIGH_PRECISION);
    } else {
      handleAddToEnd(CLIP_INCREMENT_AMOUNT_LOW_PRECISION);
    }
  }, [isPreciseToMilliseconds, handleAddToEnd]);

  const handleDecrementEndByMinimum = useCallback(() => {
    if (isPreciseToMilliseconds) {
      handleAddToEnd(-CLIP_INCREMENT_AMOUNT_HIGH_PRECISION);
    } else {
      handleAddToEnd(-CLIP_INCREMENT_AMOUNT_LOW_PRECISION);
    }
  }, [isPreciseToMilliseconds, handleAddToEnd]);

  const handleUpdateStart = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const start = parseInt(event.target.value, 10);
      if (isNaN(start)) {
        return;
      }
      setStartEndTimes([start, startEndRef.current[1]]);
    },
    [setStartEndTimes, startEndRef]
  );

  const handleUpdateEnd = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const end = parseInt(event.target.value, 10);
      if (isNaN(end)) {
        return;
      }
      setStartEndTimes([startEndRef.current[0], end]);
    },
    [setStartEndTimes, startEndRef]
  );

  return (
    <>
      <Grid container={true}>
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
        <FormControlLabel
          label="Edit clip start/end times manually"
          control={
            <Checkbox
              name="showStartEndTextFields"
              checked={showStartEndTextFields}
              onChange={onCheckboxChange}
            />
          }
        />
      </Grid>
      {showStartEndTextFields ? (
        <Grid pt={2} pl={2} pb={2} spacing={2} container={true}>
          <Grid item={true} xs={6}>
            <TextField
              label="Start"
              type="number"
              value={startEndRef.current[0]}
              onChange={handleUpdateStart}
              fullWidth={true}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <TextField
              label="End"
              type="number"
              value={startEndRef.current[1]}
              onChange={handleUpdateEnd}
              fullWidth={true}
            />
          </Grid>
        </Grid>
      ) : null}
      <Grid pb={2} container={true}>
        <Grid item={true} xs={12} lg={6}>
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
            {isPreciseToMilliseconds
              ? `-${CLIP_INCREMENT_AMOUNT_HIGH_PRECISION} ms`
              : `-${CLIP_INCREMENT_AMOUNT_LOW_PRECISION / 1000} sec`}
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementStartByMinimum}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {isPreciseToMilliseconds
              ? `+${CLIP_INCREMENT_AMOUNT_HIGH_PRECISION} ms`
              : `+${CLIP_INCREMENT_AMOUNT_LOW_PRECISION / 1000} sec`}
          </Button>
          <Button
            variant="contained"
            onClick={handleSetStartToCurrentTime}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {`Set to current time`}
          </Button>
        </Grid>
        <Grid item={true} xs={12} lg={6}>
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
            {isPreciseToMilliseconds
              ? `-${CLIP_INCREMENT_AMOUNT_HIGH_PRECISION} ms`
              : `-${CLIP_INCREMENT_AMOUNT_LOW_PRECISION / 1000} sec`}
          </Button>
          <Button
            variant="contained"
            onClick={handleIncrementEndByMinimum}
            color="primary"
            sx={{ marginRight: 1 }}
          >
            {isPreciseToMilliseconds
              ? `+${CLIP_INCREMENT_AMOUNT_HIGH_PRECISION} ms`
              : `+${CLIP_INCREMENT_AMOUNT_LOW_PRECISION / 1000} sec`}
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

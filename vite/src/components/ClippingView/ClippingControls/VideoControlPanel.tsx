import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Paper, Grid, IconButton, Tooltip, Button } from "@mui/material";
import { Dispatch, useCallback } from "react";
import { toSeconds } from "../../../utils/timestamp";
import { ActionType, ClipAction } from "../ClippingView";

interface DispatchProp {
  dispatch: Dispatch<ClipAction>;
}

const INCREMENT_AMOUNT_IMPRECISE = 1000;

function JumpToEndOfClipButton({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_END });
  }, [dispatch]);

  return (
    <Tooltip title="Jump to the end of the clip">
      <IconButton onClick={handleClick}>
        <SkipNextIcon />
      </IconButton>
    </Tooltip>
  );
}

function JumpToStartOfClipButton({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_START });
  }, [dispatch]);

  return (
    <Tooltip title="Jump to the start of the clip">
      <IconButton onClick={handleClick}>
        <SkipPreviousIcon />
      </IconButton>
    </Tooltip>
  );
}

function DecreaseClipStartTime({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.ADD_TO_CLIP_START_TIME,
      amount: -INCREMENT_AMOUNT_IMPRECISE,
    });
  }, [dispatch]);

  return (
    <Button variant="contained" onClick={handleClick}>
      -{toSeconds(INCREMENT_AMOUNT_IMPRECISE)} SEC
    </Button>
  );
}

function IncreaseClipStartTime({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({
      type: ActionType.ADD_TO_CLIP_START_TIME,
      amount: INCREMENT_AMOUNT_IMPRECISE,
    });
  }, [dispatch]);

  return (
    <Button variant="contained" onClick={handleClick}>
      +{toSeconds(INCREMENT_AMOUNT_IMPRECISE)} SEC
    </Button>
  );
}

export default function VideoControlPanel({ dispatch }: DispatchProp) {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={{ padding: 1 }}>
        <Grid container={true} justifyContent="space-around">
          <DecreaseClipStartTime dispatch={dispatch} />
          <JumpToStartOfClipButton dispatch={dispatch} />
          <IncreaseClipStartTime dispatch={dispatch} />
          <JumpToEndOfClipButton dispatch={dispatch} />
        </Grid>
      </Paper>
    </Grid>
  );
}

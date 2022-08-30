import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Paper, Grid, IconButton, Tooltip } from "@mui/material";
import { Dispatch, useCallback } from "react";
import { ActionType, ClipAction } from "../ClippingView";

interface DispatchProp {
  dispatch: Dispatch<ClipAction>;
}

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

export default function VideoControlPanel({ dispatch }: DispatchProp) {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={{ padding: 1 }}>
        <Grid container={true} justifyContent="space-around">
          <JumpToStartOfClipButton dispatch={dispatch} />
          <JumpToEndOfClipButton dispatch={dispatch} />
        </Grid>
      </Paper>
    </Grid>
  );
}

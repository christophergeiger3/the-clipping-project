import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Paper, Grid, IconButton } from "@mui/material";
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
    <IconButton onClick={handleClick}>
      <SkipNextIcon />
    </IconButton>
  );
}

// function PlayPauseButton({ dispatch }: DispatchProp) {
//   const handleClick = useCallback(() => {
//     dispatch({ type: ActionType.TOGGLE_PLAY_PAUSE });
//   } , [dispatch]);

//   return (
//     <IconButton onClick={handleClick}>
//       <SkipNextIcon />
//     </IconButton>
//   );
// }

function JumpToStartOfClipButton({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_START });
  }, [dispatch]);

  return (
    <IconButton onClick={handleClick}>
      <SkipPreviousIcon />
    </IconButton>
  );
}

export default function VideoControlPanel({ dispatch }: DispatchProp) {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={{ padding: 1 }}>
        <Grid container={true} justifyContent="space-around">
          <JumpToStartOfClipButton dispatch={dispatch} />
          {/* <PlayPauseClipButton dispatch={dispatch} /> */}
          <JumpToEndOfClipButton dispatch={dispatch} />
        </Grid>
      </Paper>
    </Grid>
  );
}

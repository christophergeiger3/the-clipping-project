import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useClipDispatch } from "@providers/ClipProvider";
import { useCallback } from "react";
import { JumpToClipEnd, JumpToClipStart } from "@/reducers/clip.action";

export function JumpToEndOfClipButton() {
  const dispatch = useClipDispatch();
  const handleClick = useCallback(() => {
    dispatch(new JumpToClipEnd());
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Jump to the end of the clip">
        <IconButton onClick={handleClick}>
          <SkipNextIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

export function JumpToStartOfClipButton() {
  const dispatch = useClipDispatch();
  const handleClick = useCallback(() => {
    dispatch(new JumpToClipStart());
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Jump to the start of the clip">
        <IconButton onClick={handleClick}>
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

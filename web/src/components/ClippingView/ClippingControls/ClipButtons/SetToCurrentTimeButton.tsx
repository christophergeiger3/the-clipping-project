import AdjustIcon from "@mui/icons-material/Adjust";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Grid } from "@mui/material";
import { useCallback } from "react";
import { useClipDispatch } from "@providers/ClipProvider";
import {
  SetEndToCurrentTime,
  SetStartToCurrentTime,
} from "@/reducers/clip.action";

export function SetClipStartToCurrentTimeButton() {
  const dispatch = useClipDispatch();

  const handleClick = useCallback(() => {
    dispatch(new SetStartToCurrentTime());
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Set the start of the clip to the current time">
        <IconButton onClick={handleClick}>
          <AdjustIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

export function SetClipEndToCurrentTimeButton() {
  const dispatch = useClipDispatch();

  const handleClick = useCallback(() => {
    dispatch(new SetEndToCurrentTime());
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Set the end of the clip to the current time">
        <IconButton onClick={handleClick}>
          <AdjustIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

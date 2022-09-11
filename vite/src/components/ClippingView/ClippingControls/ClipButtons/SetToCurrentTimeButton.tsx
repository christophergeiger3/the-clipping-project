import AdjustIcon from "@mui/icons-material/Adjust";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Grid } from "@mui/material";
import { useCallback } from "react";
import { ActionType } from "@reducers/clipReducer";
import { useClipDispatch } from "@providers/ClipProvider";

export function SetClipStartToCurrentTimeButton() {
  const dispatch = useClipDispatch();
  const type = ActionType.SET_START_TO_CURRENT_TIME;

  const handleClick = useCallback(() => {
    dispatch({ type });
  }, [dispatch, type]);

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
  const type = ActionType.SET_END_TO_CURRENT_TIME;

  const handleClick = useCallback(() => {
    dispatch({ type });
  }, [dispatch, type]);

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

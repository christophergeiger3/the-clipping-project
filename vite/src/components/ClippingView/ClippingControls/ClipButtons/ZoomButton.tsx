import { useClipDispatch, useClipState } from "@/providers/ClipProvider";
import { isNullable } from "@/utils/isNonNullable";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { ActionType } from "@reducers/clipReducer";
import { useCallback } from "react";

const { ZOOM_SLIDER_TO_RANGE } = ActionType;

export function ZoomInButton() {
  const { start, end } = useClipState();
  const dispatch = useClipDispatch();

  const handleZoom = useCallback(() => {
    if (isNullable(start) || isNullable(end)) return;
    dispatch({ type: ZOOM_SLIDER_TO_RANGE, start, end });
  }, [dispatch, end, start]);

  return (
    <Grid item={true}>
      <Tooltip title="Zoom to clip range">
        <IconButton onClick={handleZoom}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

export function ZoomResetButton() {
  const { duration } = useClipState();
  const dispatch = useClipDispatch();

  const handleZoomReset = useCallback(() => {
    if (isNullable(duration)) return;
    dispatch({ type: ZOOM_SLIDER_TO_RANGE, start: 0, end: duration });
  }, [dispatch, duration]);

  return (
    <Grid item={true}>
      <Tooltip title="Reset zoom to full video">
        <IconButton onClick={handleZoomReset}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

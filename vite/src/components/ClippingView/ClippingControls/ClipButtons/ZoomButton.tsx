import { useClipDispatch, useClipState } from "@/providers/ClipProvider";
import { ZoomSliderToRange } from "@/reducers/clip.action";
import { isNullable } from "@/utils/isNonNullable";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { useCallback } from "react";

export function ZoomInButton() {
  const { start, end } = useClipState();
  const dispatch = useClipDispatch();

  const handleZoom = useCallback(() => {
    if (isNullable(start) || isNullable(end)) return;
    dispatch(new ZoomSliderToRange({ start, end }));
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
    dispatch(new ZoomSliderToRange({ start: 0, end: duration }));
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

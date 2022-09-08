import { Slider } from "@mui/material";
import { useCallback } from "react";
import { useClipDispatch, useClipState } from "../../../providers/ClipProvider";
import { isNullable } from "../../../utils/isNonNullable";
import { ActionType } from "../../../utils/reducers/clipReducer";
import { convertMillisecondsToTimestamp } from "../../../utils/timestamp";

const { UPDATE_START_END } = ActionType;

export default function ClipStartEndTimeSlider() {
  const { start, end, duration } = useClipState();
  const dispatch = useClipDispatch();

  const handleChange = useCallback(
    (_event: Event, value: number | number[]) => {
      if (!Array.isArray(value)) return;
      const [start, end] = value;
      dispatch({ type: UPDATE_START_END, start, end });
    },
    [dispatch]
  );

  if (isNullable(start) || isNullable(end) || isNullable(duration)) {
    return null;
  }

  return (
    <Slider
      getAriaLabel={() => "Video range"}
      value={[start, end]}
      onChange={handleChange}
      min={0}
      max={duration}
      valueLabelFormat={convertMillisecondsToTimestamp}
      valueLabelDisplay="auto"
    />
  );
}

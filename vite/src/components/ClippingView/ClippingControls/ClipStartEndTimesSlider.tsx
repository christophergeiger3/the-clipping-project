import { Slider } from "@mui/material";
import { useCallback } from "react";
import { convertMillisecondsToTimestamp } from "../../../utils/timestamp";
import { ActionType, ClipAction } from "../ClippingView";

export type ClipStartEndTimes = [number, number];

interface ClipStartEndTimesSliderProps {
  start: number;
  end: number;
  duration: number;
  dispatch: React.Dispatch<ClipAction>;
}

export default function ClipStartEndTimeSlider({
  start,
  end,
  duration,
  dispatch,
}: ClipStartEndTimesSliderProps) {
  const handleChange = useCallback(
    (_event: Event, value: number | number[]) => {
      if (!Array.isArray(value)) return;
      dispatch({
        type: ActionType.UPDATE_START_END,
        start: value[0],
        end: value[1],
      });
    },
    [dispatch]
  );

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

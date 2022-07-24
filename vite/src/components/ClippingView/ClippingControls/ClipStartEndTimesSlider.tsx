import { Slider } from "@mui/material";
import { useCallback } from "react";
import convertNumberToTimestamp from "./utils/convertNumberToTimestamp";

export type ClipStartEndTimes = [number, number];

interface ClipStartEndTimesSliderProps {
  start: number;
  end: number;
  duration: number;
  onUpdateStartEndTimes: ([start, end]: ClipStartEndTimes) => void;
}

export default function ClipStartEndTimeSlider({
  start,
  end,
  duration,
  onUpdateStartEndTimes,
}: ClipStartEndTimesSliderProps) {
  const handleChange = useCallback(
    (_event: Event, value: number | number[]) => {
      if (!Array.isArray(value)) return;
      onUpdateStartEndTimes?.([value[0], value[1]]);
    },
    [onUpdateStartEndTimes]
  );

  return (
    <Slider
      getAriaLabel={() => "Video range"}
      value={[start, end]}
      onChange={handleChange}
      min={0}
      max={duration}
      valueLabelFormat={convertNumberToTimestamp}
      valueLabelDisplay="auto"
    />
  );
}

import { Slider } from "@mui/material";
import { useCallback } from "react";
import { useClipDispatch, useClipState } from "@providers/ClipProvider";
import { isNullable } from "@utils/isNonNullable";
import { convertMillisecondsToTimestamp } from "@utils/timestamp";
import { milliseconds } from "@/types";
import { UpdateClipEnd, UpdateClipStart } from "@/reducers/clip.action";

export default function ClipStartEndTimeSlider() {
  const { start, end, duration, sliderMin, sliderMax } = useClipState();
  const dispatch = useClipDispatch();

  const handleChange = useCallback(
    (_event: Event, value: number | number[], activeThumb: number) => {
      if (!Array.isArray(value)) return;

      const [start, end] = value as [milliseconds, milliseconds];

      if (activeThumb === 0) {
        dispatch(new UpdateClipStart(start));
      } else if (activeThumb === 1) {
        dispatch(new UpdateClipEnd(end));
      }
    },
    [dispatch]
  );

  if (isNullable(start) || isNullable(end) || isNullable(duration)) {
    return null;
  }

  return (
    <>
      <Slider
        getAriaLabel={() => "Video range"}
        value={[start, end]}
        onChange={handleChange}
        min={sliderMin}
        max={sliderMax}
        valueLabelFormat={convertMillisecondsToTimestamp}
        valueLabelDisplay="auto"
      />
    </>
  );
}

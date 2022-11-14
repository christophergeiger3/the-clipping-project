import { useClipDispatch, useClipState } from "@/providers/ClipProvider";
import { UpdateOptions } from "@/reducers/clip.action";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

function SettingsChecklist() {
  const dispatch = useClipDispatch();
  const { options } = useClipState();

  const handleToggleSeekOnSliderChange = useCallback(() => {
    dispatch(
      new UpdateOptions({ seekOnSliderChange: !options.seekOnSliderChange })
    );
  }, [dispatch, options.seekOnSliderChange]);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={options.seekOnSliderChange}
            onClick={handleToggleSeekOnSliderChange}
          />
        }
        label="Seek on slider movement"
      />
    </FormGroup>
  );
}

export default function Settings({ open }: { open: boolean }) {
  if (!open) {
    return null;
  }

  return (
    <Accordion expanded={open}>
      <AccordionSummary style={{ cursor: "default" }}>
        <Typography>Settings</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ cursor: "default" }}>
        <SettingsChecklist />
      </AccordionDetails>
    </Accordion>
  );
}

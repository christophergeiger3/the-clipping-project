import { useClipDispatch, useClipState } from "@/providers/ClipProvider";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useCallback } from "react";

export function SettingsButton({ onClick }: { onClick?: () => void }) {
  return (
    <Grid item={true}>
      <Tooltip title="Settings">
        <IconButton onClick={onClick}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

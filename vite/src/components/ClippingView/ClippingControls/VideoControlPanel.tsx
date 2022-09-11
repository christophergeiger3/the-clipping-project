import { Paper, Grid, SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import {
  DecreaseClipEndButton,
  DecreaseClipStartButton,
  IncreaseClipEndButton,
  IncreaseClipStartButton,
} from "./ClipButtons/IncrementClipButton";
import {
  JumpToEndOfClipButton,
  JumpToStartOfClipButton,
} from "./ClipButtons/JumpToButton";
import {
  SetClipEndToCurrentTimeButton,
  SetClipStartToCurrentTimeButton,
} from "./ClipButtons/SetToCurrentTimeButton";

const PAPER_STYLE: SxProps<Theme> = { padding: 1 };

export default function VideoControlPanel() {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={PAPER_STYLE}>
        <Grid container={true} justifyContent="center">
          <Grid container={true} xs={6} justifyContent="center" spacing={3}>
            <SetClipStartToCurrentTimeButton />
            <DecreaseClipStartButton />
            <JumpToStartOfClipButton />
            <IncreaseClipStartButton />
          </Grid>
          <Grid container={true} xs={6} justifyContent="center" spacing={3}>
            <DecreaseClipEndButton />
            <JumpToEndOfClipButton />
            <IncreaseClipEndButton />
            <SetClipEndToCurrentTimeButton />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

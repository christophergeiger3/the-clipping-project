import { Paper, Grid, SxProps } from "@mui/material";
import { Theme } from "@mui/system";
import {
  DecreaseClipEndButton,
  DecreaseClipStartButton,
  IncreaseClipEndButton,
  IncreaseClipStartButton,
  JumpToEndOfClipButton,
  JumpToStartOfClipButton,
} from "./ClipButtons";

const PAPER_STYLE: SxProps<Theme> = { padding: 1 };

export default function VideoControlPanel() {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={PAPER_STYLE}>
        <Grid container={true} justifyContent="center">
          <Grid container={true} xs={6} justifyContent="center" spacing={3}>
            <DecreaseClipStartButton />
            <JumpToStartOfClipButton />
            <IncreaseClipStartButton />
          </Grid>
          <Grid container={true} xs={6} justifyContent="center" spacing={3}>
            <DecreaseClipEndButton />
            <JumpToEndOfClipButton />
            <IncreaseClipEndButton />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

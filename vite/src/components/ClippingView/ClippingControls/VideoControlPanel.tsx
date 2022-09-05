import { Paper, Grid } from "@mui/material";
import {
  DecreaseClipEndButton,
  DecreaseClipStartButton,
  IncreaseClipEndButton,
  IncreaseClipStartButton,
  JumpToEndOfClipButton,
  JumpToStartOfClipButton,
} from "./ClipButtons";

export default function VideoControlPanel() {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={{ padding: 1 }}>
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

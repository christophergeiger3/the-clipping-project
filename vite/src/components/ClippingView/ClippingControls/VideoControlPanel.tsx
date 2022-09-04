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
        <Grid container={true} justifyContent="space-around">
          <DecreaseClipStartButton />
          <JumpToStartOfClipButton />
          <IncreaseClipStartButton />
          <DecreaseClipEndButton />
          <JumpToEndOfClipButton />
          <IncreaseClipEndButton />
        </Grid>
      </Paper>
    </Grid>
  );
}

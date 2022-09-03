import { Paper, Grid } from "@mui/material";
import { Dispatch } from "react";
import { ClipAction } from "../ClippingView";
import {
  DecreaseClipEndButton,
  DecreaseClipStartButton,
  IncreaseClipEndButton,
  IncreaseClipStartButton,
  JumpToEndOfClipButton,
  JumpToStartOfClipButton,
} from "./ClipButtons";

interface DispatchProp {
  dispatch: Dispatch<ClipAction>;
}

export default function VideoControlPanel({ dispatch }: DispatchProp) {
  return (
    <Grid padding={2}>
      <Paper elevation={1} sx={{ padding: 1 }}>
        <Grid container={true} justifyContent="space-around">
          <DecreaseClipStartButton dispatch={dispatch} />
          <JumpToStartOfClipButton dispatch={dispatch} />
          <IncreaseClipStartButton dispatch={dispatch} />
          <DecreaseClipEndButton dispatch={dispatch} />
          <JumpToEndOfClipButton dispatch={dispatch} />
          <IncreaseClipEndButton dispatch={dispatch} />
        </Grid>
      </Paper>
    </Grid>
  );
}

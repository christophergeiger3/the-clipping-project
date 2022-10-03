import { isNullable } from "@/utils/isNonNullable";
import { toSecondsPrecise } from "@/utils/timestamp";
import { VideoJsPlayer } from "video.js";
import ClipState from "./clip.state";

export abstract class ClipAction {
  /** Fires the clip-related action */
  public abstract dispatch(state: ClipState): ClipState;
}

export class JumpToClipTime extends ClipAction {
  time: number;

  constructor({ time }: { time: number }) {
    super();
    this.time = toSecondsPrecise(time);
  }

  public dispatch(state: ClipState) {
    if (isNullable(state.player)) throw new Error("No player");

    state.player.currentTime(this.time);
    return state;
  }
}

export class JumpToClipStart extends JumpToClipTime {
  public dispatch(state: ClipState): ClipState {
    const jumpToClipTimeAction = new JumpToClipTime({ time: state.start });
    return jumpToClipTimeAction.dispatch(state);
  }
}

export class JumpToClipEnd extends JumpToClipTime {
  public dispatch(state: ClipState): ClipState {
    const jumpToClipTimeAction = new JumpToClipTime({ time: state.end });
    return jumpToClipTimeAction.dispatch(state);
  }
}


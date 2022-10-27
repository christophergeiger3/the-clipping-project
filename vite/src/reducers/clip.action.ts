import { pauseIfOutsideClip } from "@utils/player";
import clamp from "@/utils/clamp";
import { isNullable } from "@/utils/isNonNullable";
import { toSecondsPrecise } from "@/utils/timestamp";
import { VideoJsPlayer } from "video.js";
import ClipState from "./clip.state";

export interface ClipAction {
  /** Fires the clip-related action */
  execute(state: ClipState): ClipState;
}

export class PlayerReadyAction implements ClipAction {
  public constructor(public player: VideoJsPlayer) {}

  public execute(state: ClipState): ClipState {
    const { player } = this;
    const duration = toSecondsPrecise(player.duration());

    return new ClipState({
      ...state,
      duration,
    });
  }
}

export class UpdateStartEnd implements ClipAction {
  public constructor(public start: number, public end: number) {}

  public execute(state: ClipState): ClipState {
    return { ...state, start: this.start, end: this.end };
  }
}

export class PlayerTimeUpdate implements ClipAction {
  public execute(state: ClipState): ClipState {
    const { player, start, end } = state;

    if (isNullable(player) || isNullable(start) || isNullable(end)) {
      throw new Error("Player is not ready");
    }

    pauseIfOutsideClip(player, start, end);
    return state;
  }
}
export class SetPlayerSource implements ClipAction {
  public src: string;
  public originalUrl: string;

  constructor({ src, originalUrl }: { src: string; originalUrl: string }) {
    this.src = src;
    this.originalUrl = originalUrl;
  }

  public execute(state: ClipState): ClipState {
    const { src, originalUrl } = this;
    const { player } = state;

    if (isNullable(player)) {
      throw new Error("Player is not ready");
    }

    player.src({ src, type: "video/mp4" });
    return { ...state, src, originalUrl };
  }
}

export class JumpToClipTime implements ClipAction {
  time: number;

  constructor({ time }: { time: number }) {
    this.time = toSecondsPrecise(time);
  }

  public execute(state: ClipState) {
    if (isNullable(state.player)) throw new Error("No player");

    state.player.currentTime(this.time);
    return state;
  }
}

export class JumpToClipStart extends JumpToClipTime {
  constructor() {
    super({ time: 0 });
  }

  public execute(state: ClipState): ClipState {
    this.time = state.start;
    return super.execute(state);
  }
}

export class JumpToClipEnd extends JumpToClipTime {
  constructor() {
    super({ time: 0 });
  }

  public execute(state: ClipState): ClipState {
    this.time = state.end;
    return super.execute(state);
  }
}

class AddAmount implements ClipAction {
  amount: number;

  constructor({ amount }: { amount: number }) {
    this.amount = amount;
  }

  public execute(state: ClipState): ClipState {
    return state;
  }
}

export class AddAmountToClipStart extends AddAmount {
  public execute(state: ClipState) {
    if (isNullable(state.start) || isNullable(state.duration)) {
      throw new Error("No player");
    }

    return {
      ...state,
      start: clamp(state.start + this.amount, 0, state.duration),
    };
  }
}

export class AddAmountToClipEnd extends AddAmount {
  public execute(state: ClipState) {
    if (isNullable(state.end) || isNullable(state.duration)) {
      throw new Error("No player");
    }

    return {
      ...state,
      end: clamp(state.end + this.amount, 0, state.duration),
    };
  }
}

export class SetStartToCurrentTime implements ClipAction {
  public execute(state: ClipState): ClipState {
    if (isNullable(state.player)) throw new Error("No player");
    return { ...state, start: state.player.currentTime() };
  }
}

export class SetEndToCurrentTime implements ClipAction {
  public execute(state: ClipState): ClipState {
    if (isNullable(state.player)) throw new Error("No player");
    return { ...state, end: state.player.currentTime() };
  }
}

export class ZoomSliderToRange implements ClipAction {
  public start: number;
  public end: number;

  constructor(options: { start: number; end: number }) {
    this.start = options.start;
    this.end = options.end;
  }

  public execute(state: ClipState): ClipState {
    return { ...state, sliderMin: this.start, sliderMax: this.end };
  }
}

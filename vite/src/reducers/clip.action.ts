import { toMilliseconds } from "@utils/timestamp";
import { pauseIfOutsideClip } from "@utils/player";
import clamp from "@/utils/clamp";
import { isNullable } from "@/utils/isNonNullable";
import { toSecondsPrecise } from "@/utils/timestamp";
import { VideoJsPlayer } from "video.js";
import ClipState from "./clip.state";
import { milliseconds } from "@/types";

export interface ClipAction {
  /** Fires the clip-related action */
  execute(state: ClipState): ClipState;
}

export class PlayerReadyAction implements ClipAction {
  public constructor(public player: VideoJsPlayer) {}

  public execute(state: ClipState): ClipState {
    const { player } = this;
    const duration = toMilliseconds(player.duration());

    return new ClipState({
      ...state,
      player,
      end: duration,
      duration,
      sliderMin: 0 as milliseconds,
      sliderMax: duration,
    });
  }
}

export class UpdateStartEnd implements ClipAction {
  public constructor(public start: milliseconds, public end: milliseconds) {}

  public execute(state: ClipState): ClipState {
    return new ClipState({ ...state, start: this.start, end: this.end });
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
    return new ClipState({ ...state, src, originalUrl });
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
    this.time = toSecondsPrecise(state.start);
    return super.execute(state);
  }
}

export class JumpToClipEnd extends JumpToClipTime {
  constructor() {
    super({ time: 0 });
  }

  public execute(state: ClipState): ClipState {
    this.time = toSecondsPrecise(state.end);
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

    const start = clamp(state.start + this.amount, 0, state.duration);

    return new ClipState({
      ...state,
      start: start as milliseconds,
    });
  }
}

export class AddAmountToClipEnd extends AddAmount {
  public execute(state: ClipState) {
    if (isNullable(state.end) || isNullable(state.duration)) {
      throw new Error("No player");
    }

    const end = clamp(state.end + this.amount, 0, state.duration);

    return new ClipState({
      ...state,
      end: end as milliseconds,
    });
  }
}

export class SetStartToCurrentTime implements ClipAction {
  public execute(state: ClipState): ClipState {
    if (isNullable(state.player)) throw new Error("No player");
    return new ClipState({
      ...state,
      start: toMilliseconds(state.player.currentTime()),
    });
  }
}

export class SetEndToCurrentTime implements ClipAction {
  public execute(state: ClipState): ClipState {
    if (isNullable(state.player)) throw new Error("No player");
    return new ClipState({
      ...state,
      end: toMilliseconds(state.player.currentTime()),
    });
  }
}

export class ZoomSliderToRange implements ClipAction {
  public start: milliseconds;
  public end: milliseconds;

  constructor(options: { start: milliseconds; end: milliseconds }) {
    this.start = options.start;
    this.end = options.end;
  }

  public execute(state: ClipState): ClipState {
    return new ClipState({
      ...state,
      sliderMin: this.start,
      sliderMax: this.end,
    });
  }
}

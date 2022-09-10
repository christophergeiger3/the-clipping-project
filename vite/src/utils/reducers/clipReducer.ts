import videojs, { VideoJsPlayer } from "video.js";
import clamp from "../clamp";
import isNonNullable from "../isNonNullable";
import { jumpToTime, pauseIfOutsideClip } from "../player";
import { toMilliseconds } from "../timestamp";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export type ClipState = {
  start?: number;
  end?: number;
  duration?: number;
  src: string;
  player?: VideoJsPlayer;
};

export enum ActionType {
  PLAYER_READY,
  UPDATE_START_END,
  PLAYER_TIME_UPDATE,
  JUMP_TO_CLIP_START,
  JUMP_TO_CLIP_END,
  ADD_TO_CLIP_START_TIME,
  ADD_TO_CLIP_END_TIME,
}

export type ClipAction =
  | { type: ActionType.PLAYER_READY; player: videojs.Player }
  | { type: ActionType.UPDATE_START_END; start: number; end: number }
  | { type: ActionType.PLAYER_TIME_UPDATE; player: videojs.Player }
  | { type: ActionType.JUMP_TO_CLIP_START }
  | { type: ActionType.JUMP_TO_CLIP_END }
  | { type: ActionType.ADD_TO_CLIP_START_TIME; amount: number }
  | { type: ActionType.ADD_TO_CLIP_END_TIME; amount: number };

export const DEFAULT_CLIP_STATE: ClipState = {
  start: undefined,
  end: undefined,
  duration: undefined,
  src: DEFAULT_VIDEO_SRC,
  player: undefined,
};

/** Controls the clip player */
export default function clipReducer(state: ClipState, action: ClipAction) {
  switch (action.type) {
    case ActionType.PLAYER_READY: {
      const { player } = action;
      const duration = toMilliseconds(player.duration());
      return { ...state, duration, start: 0, end: duration, player };
    }
    case ActionType.UPDATE_START_END: {
      const { start, end } = action;
      return { ...state, start, end };
    }
    case ActionType.PLAYER_TIME_UPDATE: {
      const { player } = action;
      const { start, end } = state;
      if (isNonNullable(start) && isNonNullable(end)) {
        pauseIfOutsideClip(player, start, end);
      }
      return state;
    }
    case ActionType.JUMP_TO_CLIP_START: {
      const { player, start } = state;
      if (isNonNullable(player) && isNonNullable(start)) {
        jumpToTime(player, start);
      }
      return state;
    }
    case ActionType.JUMP_TO_CLIP_END: {
      const { player, end } = state;
      if (isNonNullable(player) && isNonNullable(end)) {
        jumpToTime(player, end);
      }
      return state;
    }
    case ActionType.ADD_TO_CLIP_START_TIME: {
      const { start, duration } = state;
      const { amount } = action;
      if (isNonNullable(start) && isNonNullable(duration)) {
        const newStart = clamp(start + amount, 0, duration);
        return { ...state, start: newStart };
      }
      return state;
    }
    case ActionType.ADD_TO_CLIP_END_TIME: {
      const { end, duration } = state;
      const { amount } = action;
      if (isNonNullable(end) && isNonNullable(duration)) {
        const newEnd = clamp(end + amount, 0, duration);
        return { ...state, end: newEnd };
      }
      return state;
    }
    default:
      return state;
  }
}

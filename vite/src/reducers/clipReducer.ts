import videojs, { VideoJsPlayer } from "video.js";
import clamp from "@utils/clamp";
import isNonNullable from "@utils/isNonNullable";
import { jumpToTime, pauseIfOutsideClip } from "@utils/player";
import { toMilliseconds } from "@utils/timestamp";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export type ClipState = {
  start?: number;
  end?: number;
  duration?: number;
  sliderMin?: number;
  sliderMax?: number;
  /** Raw video source for the video player -- the result from analyzing the original url */
  src: string;
  /** The URL of the current clip before its analyzed into a raw video source for the player */
  originalUrl: string;
  player?: VideoJsPlayer;
};

export enum ActionType {
  PLAYER_READY,
  UPDATE_START_END,
  PLAYER_TIME_UPDATE,
  PLAYER_SET_SRC,
  JUMP_TO_CLIP_START,
  JUMP_TO_CLIP_END,
  ADD_TO_CLIP_START_TIME,
  ADD_TO_CLIP_END_TIME,
  SET_START_TO_CURRENT_TIME,
  SET_END_TO_CURRENT_TIME,
  ZOOM_SLIDER_TO_RANGE,
}

export type ClipAction =
  | { type: ActionType.PLAYER_READY; player: videojs.Player }
  | { type: ActionType.UPDATE_START_END; start: number; end: number }
  | { type: ActionType.PLAYER_TIME_UPDATE; player: videojs.Player }
  | { type: ActionType.PLAYER_SET_SRC; src: string; originalUrl: string }
  | { type: ActionType.JUMP_TO_CLIP_START }
  | { type: ActionType.JUMP_TO_CLIP_END }
  | { type: ActionType.ADD_TO_CLIP_START_TIME; amount: number }
  | { type: ActionType.ADD_TO_CLIP_END_TIME; amount: number }
  | { type: ActionType.SET_START_TO_CURRENT_TIME }
  | { type: ActionType.SET_END_TO_CURRENT_TIME }
  | { type: ActionType.ZOOM_SLIDER_TO_RANGE; start: number; end: number };

export const DEFAULT_CLIP_STATE: ClipState = {
  start: undefined,
  end: undefined,
  duration: undefined,
  sliderMin: undefined,
  sliderMax: undefined,
  src: DEFAULT_VIDEO_SRC,
  originalUrl: DEFAULT_VIDEO_SRC,
  player: undefined,
};

/** Controls the clip player */
export default function clipReducer(state: ClipState, action: ClipAction) {
  switch (action.type) {
    case ActionType.PLAYER_READY: {
      const { player } = action;
      const duration = toMilliseconds(player.duration());
      return {
        ...state,
        duration,
        start: 0,
        end: duration,
        sliderMin: 0,
        sliderMax: duration,
        player,
      };
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
    case ActionType.PLAYER_SET_SRC: {
      const { src, originalUrl } = action;
      const { player } = state;

      player?.src({ src, type: "video/mp4" });
      return { ...state, src, originalUrl };
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
    case ActionType.SET_START_TO_CURRENT_TIME: {
      const { player } = state;
      if (isNonNullable(player)) {
        const start = toMilliseconds(player.currentTime());
        return { ...state, start };
      }
      return state;
    }
    case ActionType.SET_END_TO_CURRENT_TIME: {
      const { player } = state;
      if (isNonNullable(player)) {
        const end = toMilliseconds(player.currentTime());
        return { ...state, end };
      }
      return state;
    }
    case ActionType.ZOOM_SLIDER_TO_RANGE: {
      const { start, end } = action;
      return { ...state, sliderMin: start, sliderMax: end };
    }
    default:
      return state;
  }
}

import { useCallback, useReducer } from "react";
import videojs from "video.js";
import { toMilliseconds } from "../../utils/timestamp";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

type ClipState = {
  start?: number;
  end?: number;
  duration?: number;
  src: string;
};

export enum ActionType {
  PLAYER_READY = "PLAYER_READY",
  UPDATE_START_END = "UPDATE_START_END",
}

export type ClipAction =
  | { type: ActionType.PLAYER_READY; duration: number }
  | { type: ActionType.UPDATE_START_END; start: number; end: number };

const DEFAULT_CLIP_STATE: ClipState = {
  start: undefined,
  end: undefined,
  duration: undefined,
  src: DEFAULT_VIDEO_SRC,
};

function clipReducer(state: ClipState, action: ClipAction) {
  switch (action.type) {
    case ActionType.PLAYER_READY: {
      const { duration } = action;
      return { ...state, duration, start: 0, end: duration };
    }
    case ActionType.UPDATE_START_END: {
      const { start, end } = action;
      return { ...state, start, end };
    }
    default:
      return state;
  }
}

export default function ClippingView() {
  const [{ start, end, duration, src }, dispatch] = useReducer(
    clipReducer,
    DEFAULT_CLIP_STATE
  );

  const handleVideoPlayerReady = useCallback<videojs.ReadyCallback>(function (
    this: videojs.Player
  ) {
    this.on("loadedmetadata", () => {
      dispatch({
        type: ActionType.PLAYER_READY,
        duration: toMilliseconds(this.duration()),
      });
    });
  },
  []);

  const showClipStartEndTimesSlider =
    isNonNullable(start) && isNonNullable(end) && isNonNullable(duration);

  return (
    <>
      <VideoPlayer src={src} onVideoPlayerReady={handleVideoPlayerReady} />
      {showClipStartEndTimesSlider ? (
        <ClipStartEndTimesSlider
          start={start}
          end={end}
          duration={duration}
          dispatch={dispatch}
        />
      ) : null}
      <VideoControlPanel />
      <ClippingControlPanel />
      <ViewAllClipsButton />
    </>
  );
}

import { useCallback, useReducer } from "react";
import videojs from "video.js";
import isNonNullable from "../../utils/isNonNullable";
import { toMilliseconds, toSecondsPrecise } from "../../utils/timestamp";
import ClippingControlPanel from "./ClippingControls/ClippingControlPanel";
import ClipStartEndTimesSlider from "./ClippingControls/ClipStartEndTimesSlider";
import VideoControlPanel from "./ClippingControls/VideoControlPanel";
import VideoPlayer from "./VideoPlayer";
import ViewAllClipsButton from "./ViewAllClipsButton";

const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

type ClipState = {
  start?: number;
  end?: number;
  duration?: number;
  src: string;
};

export enum ActionType {
  PLAYER_READY,
  UPDATE_START_END,
  PLAYER_TIME_UPDATE,
}

export type ClipAction =
  | { type: ActionType.PLAYER_READY; player: videojs.Player }
  | { type: ActionType.UPDATE_START_END; start: number; end: number }
  | { type: ActionType.PLAYER_TIME_UPDATE; player: videojs.Player };

const DEFAULT_CLIP_STATE: ClipState = {
  start: undefined,
  end: undefined,
  duration: undefined,
  src: DEFAULT_VIDEO_SRC,
};

function pauseIfOutsideClip(
  player: videojs.Player,
  start: number,
  end: number
) {
  const currentTime = toMilliseconds(player.currentTime());
  if (currentTime > end) {
    player.currentTime(toSecondsPrecise(end));
    player.pause();
  } else if (currentTime < start) {
    player.currentTime(toSecondsPrecise(start));
    player.pause();
  }
}

function clipReducer(state: ClipState, action: ClipAction) {
  switch (action.type) {
    case ActionType.PLAYER_READY: {
      const { player } = action;
      const duration = toMilliseconds(player.duration());
      return { ...state, duration, start: 0, end: duration };
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
    default:
      return state;
  }
}

export default function ClippingView() {
  const [{ start, end, duration, src }, dispatch] = useReducer(
    clipReducer,
    DEFAULT_CLIP_STATE
  );

  const onLoadedMetadata = useCallback(function (this: videojs.Player) {
    dispatch({ type: ActionType.PLAYER_READY, player: this });
  }, []);

  const onTimeUpdate = useCallback(function (this: videojs.Player) {
    dispatch({
      type: ActionType.PLAYER_TIME_UPDATE,
      player: this,
    });
  }, []);

  const handleVideoPlayerReady = useCallback<videojs.ReadyCallback>(
    function (this: videojs.Player) {
      this.on("loadedmetadata", onLoadedMetadata);
      this.on("timeupdate", onTimeUpdate);
    },
    [onLoadedMetadata, onTimeUpdate]
  );

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

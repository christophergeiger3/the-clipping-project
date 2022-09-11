import videojs from "video.js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import clipReducer, {
  ActionType,
  ClipAction,
  ClipState,
  DEFAULT_CLIP_STATE,
} from "@reducers/clipReducer";

interface ClipContext {
  dispatch: React.Dispatch<ClipAction>;
  state: ClipState;
  handleVideoPlayerReady: videojs.ReadyCallback;
}

export const ClipContext = createContext<ClipContext | undefined>(undefined);

const { PLAYER_READY, PLAYER_TIME_UPDATE } = ActionType;

export function useClipContext() {
  const context = useContext(ClipContext);

  if (!context) {
    throw new Error("Hook must be used within a ClipProvider");
  }

  return context;
}

export function useClipDispatch() {
  const { dispatch } = useClipContext();
  return dispatch;
}

export function useClipState() {
  const { state } = useClipContext();
  return state;
}

export default function ClipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(clipReducer, DEFAULT_CLIP_STATE);

  const onLoadedMetadata = useCallback(
    function (this: videojs.Player) {
      dispatch({ type: PLAYER_READY, player: this });
    },
    [dispatch]
  );

  const onTimeUpdate = useCallback(
    function (this: videojs.Player) {
      dispatch({ type: PLAYER_TIME_UPDATE, player: this });
    },
    [dispatch]
  );

  const handleVideoPlayerReady = useCallback<videojs.ReadyCallback>(
    function (this: videojs.Player) {
      this.on("loadedmetadata", onLoadedMetadata);
      this.on("timeupdate", onTimeUpdate);
    },
    [onLoadedMetadata, onTimeUpdate]
  );

  const value = useMemo(
    () => ({ dispatch, state, handleVideoPlayerReady }),
    [dispatch, handleVideoPlayerReady, state]
  );

  return <ClipContext.Provider value={value}>{children}</ClipContext.Provider>;
}

import videojs from "video.js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import ClipState from "@/reducers/clip.state";
import {
  ClipAction,
  PlayerReadyAction,
  PlayerTimeUpdate,
} from "@/reducers/clip.action";
import reducer from "@/reducers/clip.reducer";

interface ClipContext {
  dispatch: React.Dispatch<ClipAction>;
  state: ClipState;
  handleVideoPlayerReady: videojs.ReadyCallback;
}

export const ClipContext = createContext<ClipContext | undefined>(undefined);

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
  const [state, dispatch] = useReducer(reducer, new ClipState());

  const onLoadedMetadata = useCallback(
    function (this: videojs.Player) {
      dispatch(new PlayerReadyAction(this));
    },
    [dispatch]
  );

  const onTimeUpdate = useCallback(
    function (this: videojs.Player) {
      dispatch(new PlayerTimeUpdate());
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

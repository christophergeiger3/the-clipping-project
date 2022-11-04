import { VideoJsPlayer } from "video.js";

export const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default class ClipState {
  start = 0;
  end = 0;
  duration = 0;
  sliderMin = 0;
  sliderMax = this.duration;
  /** Raw video source for the video player -- the result from analyzing the original url */
  src = DEFAULT_VIDEO_SRC;
  /** The URL of the current clip before its analyzed into a raw video source for the player */
  originalUrl = this.src;
  player?: VideoJsPlayer;

  constructor(initialState?: ClipState) {
    if (!initialState) {
      return;
    }

    Object.assign(this, initialState);
  }
}

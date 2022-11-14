import { milliseconds } from "@/types";
import { VideoJsPlayer } from "video.js";

export const DEFAULT_VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export class ClipOptions {
  seekOnSliderChange = true;
}

export default class ClipState {
  start = 0 as milliseconds;
  end = 0 as milliseconds;
  duration = 0 as milliseconds;
  sliderMin = 0 as milliseconds;
  sliderMax = this.duration as milliseconds;
  /** Raw video source for the video player -- the result from analyzing the original url */
  src = DEFAULT_VIDEO_SRC;
  /** The URL of the current clip before its analyzed into a raw video source for the player */
  originalUrl = this.src;
  player?: VideoJsPlayer;
  options = new ClipOptions();

  constructor(initialState?: ClipState) {
    if (!initialState) {
      return;
    }

    Object.assign(this, initialState);
  }
}

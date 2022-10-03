import { VideoJsPlayer } from "video.js";

export default class ClipState {
  start: number;
  end: number;
  duration: number;
  sliderMin: number;
  sliderMax: number;
  /** Raw video source for the video player -- the result from analyzing the original url */
  src: string;
  /** The URL of the current clip before its analyzed into a raw video source for the player */
  originalUrl: string;
  player?: VideoJsPlayer;

  constructor(initialState: ClipState) {
    this.duration = initialState.duration ?? 0;
    this.start = initialState.start ?? 0;
    this.end = initialState.end ?? this.duration;
    this.sliderMin = initialState.sliderMin ?? 0;
    this.sliderMax = initialState.sliderMax ?? this.duration;
    this.src = initialState.src;
    this.originalUrl = initialState.originalUrl;
  }
}
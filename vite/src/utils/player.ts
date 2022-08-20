import { toMilliseconds, toSecondsPrecise } from "./timestamp";
import videojs from "video.js";

export function pauseIfOutsideClip(
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

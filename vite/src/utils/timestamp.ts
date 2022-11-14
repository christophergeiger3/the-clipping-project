import { milliseconds } from "@/types";

/** Seconds to milliseconds */
export function toMilliseconds(seconds: number): milliseconds {
  return Math.floor(seconds * 1000) as milliseconds;
}

/** Milliseconds to seconds, no decimal */
export function toSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

/** Milliseconds to seconds, with decimal */
export function toSecondsPrecise(milliseconds: number): number {
  return milliseconds / 1000;
}

export function convertSecondsToTimestamp(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const secondsLeft = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secondsLeft
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${secondsLeft.toString().padStart(2, "0")}`;
  }
}

export function convertMillisecondsToTimestamp(milliseconds: number): string {
  const secondsTimestamp = convertSecondsToTimestamp(toSeconds(milliseconds));
  return `${secondsTimestamp}.${milliseconds % 1000}`;
}

export function convertDurationToHumanReadable(milliseconds: number): string {
  const seconds = toSeconds(milliseconds) % 60;
  const minutes = Math.floor(toSeconds(milliseconds) / 60) % 60;
  const hours = Math.floor(toSeconds(milliseconds) / 60 / 60);

  let humanReadable = "";

  if (hours > 0) {
    humanReadable += `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (minutes > 0) {
    humanReadable += `${humanReadable ? ", " : ""}${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  }

  if (seconds > 0) {
    humanReadable += `${humanReadable ? ", " : ""}${seconds} second${
      seconds > 1 ? "s" : ""
    }`;
  }

  return humanReadable;
}

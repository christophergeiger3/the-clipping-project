/** Seconds to milliseconds */
export function toMilliseconds(seconds: number): number {
  return Math.floor(seconds * 1000);
}

/** Milliseconds to seconds */
export function toSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
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

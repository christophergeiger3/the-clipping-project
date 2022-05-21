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

export function convertMillisecondsToTimestamp(
  milliseconds: number,
  preciseToMilliseconds = true
) {
  if (preciseToMilliseconds) {
    return (
      convertSecondsToTimestamp(Math.floor(milliseconds / 1000)) +
      "." +
      (milliseconds % 1000)
    );
  }
  const seconds = Math.floor(milliseconds / 1000);
  return convertSecondsToTimestamp(seconds);
}

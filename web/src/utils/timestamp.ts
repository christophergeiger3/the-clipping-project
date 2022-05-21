
export function convertSecondsToTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
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

/** Clamps value on the interval [min, max], inclusive */
export default function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

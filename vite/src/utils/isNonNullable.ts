
export default function isNonNullable<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
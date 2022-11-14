export default function isNonNullable<T>(
  value: T | null | undefined
): value is T {
  return value !== null && value !== undefined;
}

export function isNullable<T>(
  value: T | null | undefined
): value is null | undefined {
  return value === null || value === undefined;
}

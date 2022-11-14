// see: https://www.typescriptlang.org/play#example/nominal-typing
type Brand<K, T> = K & { __brand: T };
export type milliseconds = Brand<number, "milliseconds">;

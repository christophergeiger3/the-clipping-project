// see: https://www.typescriptlang.org/play#example/nominal-typing
export type milliseconds = number & { __brand: "milliseconds" };

export const INCREMENT_AMOUNT_IMPRECISE = 1000 as milliseconds;
export const DECREMENT_AMOUNT_IMPRECISE = -1000 as milliseconds;

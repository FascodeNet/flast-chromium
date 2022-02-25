export const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export const split = <T>(data: T[], count: number) => data.slice(0, Math.min(data.length, count));

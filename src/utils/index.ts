export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T;

export const equals = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase() === s2.toLowerCase() : s1 === s2;

export const includes = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().includes(s2.toLowerCase()) : s1.includes(s2);

export const startsWith = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().startsWith(s2.toLowerCase()) : s1.startsWith(s2);

export const endsWith = (s1: string, s2: string, ignoreCase: boolean = false) =>
    ignoreCase ? s1.toLowerCase().endsWith(s2.toLowerCase()) : s1.endsWith(s2);

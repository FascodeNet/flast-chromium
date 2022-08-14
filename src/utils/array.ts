import deepmerge from 'deepmerge';

export const nonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export const split = <T>(data: T[], count: number) => data.slice(0, Math.min(data.length, count));

export const sort = <E, T>(data: E[], types: T[], callback: (elem: E) => T) => data.sort((a, b) => types.findIndex((type) => type === callback(a)) - types.findIndex((type) => type === callback(b)));

export const combineMerge = (target: any[], source: any[], options: deepmerge.Options) => {
    const destination = target.slice();

    source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
            destination[index] = (options as any).cloneUnlessOtherwiseSpecified(item, options);
        } else if (options.isMergeableObject!!(item)) {
            destination[index] = deepmerge(target[index], item, options);
        } else if (target.indexOf(item) === -1) {
            destination.push(item);
        }
    });
    return destination;
};

import { Pair } from '../interfaces/pair';

export const isURL = (input: string) => {
    const pattern = /^((?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)|about:\/\/\S.*|flast:\/\/\S.*|file:\/\/\S.*)\S*$/;
    return pattern.test(input) || pattern.test(`http://${input}`);
};

export const prefixHttp = (url: string) => {
    const trimmedUrl = url.trim();
    return trimmedUrl.includes('://') ? trimmedUrl : `http://${trimmedUrl}`;
};

export const parseHash = (hash: string | undefined): Pair<string, string>[] => {
    if (!hash)
        return [];

    hash = hash.trim();
    if (hash.startsWith('#'))
        hash = hash.substring(1);

    return hash.split('&').map((query): Pair<string, string> => {
        const values = query.split('=');
        return { key: values[0], value: values[1] };
    });
};

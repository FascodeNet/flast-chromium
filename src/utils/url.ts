export const isURL = (input: string) => {
    const pattern = /^((?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)|about:\/\/\S.*|flast:\/\/\S.*|file:\/\/\S.*)\S*$/;
    return pattern.test(input) || pattern.test(`http://${input}`);
};

export const prefixHttp = (url: string) => {
    const trimmedUrl = url.trim();
    return trimmedUrl.includes('://') ? trimmedUrl : `http://${trimmedUrl}`;
};

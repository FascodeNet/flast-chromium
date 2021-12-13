import axios from 'axios';
import { app, nativeImage } from 'electron';

export const getDataURL = async (url: string) => {
    const res = await axios.get(url);

    const data = res.data;
    const type = res.headers['content-type'];

    const mediaType = /\//.test(type) ? type : `image/${type}`;
    const dataBase64 = (Buffer.isBuffer(data)) ? data.toString('base64') : new Buffer(data).toString('base64');

    console.log(url, type, mediaType, dataBase64);

    return `data:${mediaType};base64,${dataBase64}`;
};

export const getNativeImage = async (url: string) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    const data = res.data;
    const type = res.headers['content-type'];
    const mediaType = /\//.test(type) ? type : `image/${type}`;

    const buffer = Buffer.from(data, 'binary');
    const base64 = buffer.toString('base64');

    console.log(base64);

    return nativeImage.createFromDataURL(`data:${mediaType};base64,${base64}`);
};

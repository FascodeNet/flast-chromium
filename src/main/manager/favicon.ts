import Datastore from '@seald-io/nedb';
import { fileTypeFromBuffer } from 'file-type';
import * as icojs from 'icojs';
import { Favicon } from '../../interfaces/view';
import { requestURL } from '../../utils/network';
import { getSpecialPath } from '../../utils/path';
import { prefixHttp } from '../../utils/url';
import { Main } from '../main';

export class FaviconManager {

    private readonly _datastore: Datastore<Favicon>;

    private readonly _favicons: Favicon[];

    public constructor() {
        this._datastore = new Datastore<Favicon>({
            filename: getSpecialPath('appData', 'Favicons.db'),
            autoload: true,
            timestampData: true
        });

        this._favicons = this._datastore.getAllData();
    }

    public get datastore() {
        return this._datastore;
    }

    public get favicons() {
        return this._favicons;
    }

    public static async getFavicon(url: string, faviconUrl: string) {
        const urlString = FaviconManager.toUrl(url);
        if (!urlString)
            return Promise.reject('Invalid URL!');

        const faviconData = Main.faviconManager.favicons.find(({ url }) => url === urlString);
        if (!faviconData) {
            const res = await requestURL(faviconUrl);

            if (res.statusCode === 404)
                throw new Error('Favicon not found!');

            let data = Buffer.from(res.data, 'binary');

            const type = await fileTypeFromBuffer(data);

            if (type && type.ext === 'ico')
                data = Buffer.from(new Uint8Array(await FaviconManager.convertIcoToPng(data)));

            return `data:${(await fileTypeFromBuffer(data))!!.ext};base64,${data.toString('base64')}`;
        } else {
            return faviconData.favicon;
        }
    }

    public add(data: Favicon) {
        this._favicons.push(data);
        this._datastore.update({ url: data.url }, data, { upsert: true });
    }

    public static toUrl(u: string) {
        if (u.length < 1)
            return undefined;

        try {
            const { host, pathname } = new URL(prefixHttp(u));
            return `${host}${pathname}`;
        } catch {
            return undefined;
        }
    }

    private static async convertIcoToPng(icoData: Buffer) {
        return (await icojs.parse(icoData, 'image/png'))[0].buffer;
    }

    public get(u: string) {
        const urlString = FaviconManager.toUrl(u);
        if (!urlString)
            return Promise.reject('Invalid URL!');

        const data = this._favicons.find(({ url }) => url === urlString);
        if (data)
            return Promise.resolve(data);

        this._datastore.findOne({ url: urlString } as Partial<Favicon>, (err, doc: Favicon) => {
            if (err)
                return Promise.reject('Data not found!');

            return Promise.resolve(doc);
        });
    }
}

import { app } from 'electron';
import Datastore from 'nedb';
import { join } from 'path';
import { Favicon } from '../../interfaces/view';
import { prefixHttp } from '../../utils/url';

export class FaviconManager {

    private _datastore: Datastore<Favicon>;

    private _favicons: Favicon[];

    constructor() {
        this._datastore = new Datastore<Favicon>({
            filename: join(app.getPath('userData'), 'favicons.db'),
            autoload: true,
            timestampData: true
        });

        this._favicons = this._datastore.getAllData();
    }

    public get datastore() {
        return this._datastore;
    }

    public get(u: string) {
        const urlString = FaviconManager.toUrl(u);
        if (!urlString)
            return Promise.reject('Data not found!');

        const data = this._favicons.find(({ url }) => url === urlString);
        if (data)
            return Promise.resolve(data);

        this._datastore.findOne({ url: urlString } as Partial<Favicon>, (err, doc: Favicon) => {
            if (err)
                return Promise.reject('Data not found!');

            return Promise.resolve(doc);
        });
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
}

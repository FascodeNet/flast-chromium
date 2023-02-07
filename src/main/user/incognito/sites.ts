import Datastore from '@seald-io/nedb';
import {
    ContentType,
    IData,
    OmitData,
    SiteContentCookieData,
    SiteContentData,
    SiteContentZoomLevelData,
    SitePermissionData
} from '../../../interfaces/user';
import { ISites, IUser } from '../../interfaces/user';
import { PermissionType } from '../../session/permission';

export class IncognitoSites implements ISites {

    public readonly user: IUser;

    private readonly _datastore: Datastore;
    private _sites: Required<SitePermissionData | SiteContentData | SiteContentCookieData | SiteContentZoomLevelData>[] = [];

    public constructor(user: IUser) {
        this.user = user;

        this._datastore = new Datastore<SitePermissionData | SiteContentData | SiteContentCookieData | SiteContentZoomLevelData>({
            timestampData: true
        });

        this._datastore.find({}, {}, (err, docs: Required<SitePermissionData | SiteContentData | SiteContentCookieData | SiteContentZoomLevelData>[]) => {
            if (err) throw new Error('The data could not be read!');
            this._sites = docs;
        });
    }

    public get datastore() {
        return this._datastore;
    }

    public get sites() {
        return this._sites;
    }

    public get permissions(): Required<SitePermissionData>[] {
        return this._sites.filter((site): site is Required<SitePermissionData> => site.kind === 'permission');
    }

    public get contents(): Required<SiteContentData>[] {
        return this._sites.filter((site): site is Required<SiteContentData> => site.kind === 'content');
    }

    public get cookies(): Required<SiteContentCookieData>[] {
        return this._sites.filter((site): site is Required<SiteContentCookieData> => 'allow3rdParty' in site);
    }

    public get zoomLevels(): Required<SiteContentZoomLevelData>[] {
        return this._sites.filter((site): site is Required<SiteContentZoomLevelData> => 'level' in site);
    }

    public getPermission(origin: string, type: PermissionType): Required<SitePermissionData> | undefined {
        return this.permissions.find((site) => site.origin === origin && site.type === type);
    }

    public getContent(origin: string, type: ContentType): Required<SiteContentData> | undefined {
        return this.contents.find((site) => site.origin === origin && site.type === type);
    }

    public async add<T extends IData>(data: OmitData<T>) {
        const doc = await this._datastore.insertAsync(data) as unknown;
        this._sites.push(doc as Required<SitePermissionData | SiteContentData | SiteContentCookieData | SiteContentZoomLevelData>);
        return doc as Required<T>;
    }

    public async remove(id: string) {
        this._sites = this._sites.filter((data) => data._id !== id);
        return await this._datastore.removeAsync({ _id: id }, {}) > 0;
    }

    public async update<T extends IData>(id: string, data: OmitData<T>) {
        const doc: Required<T> = (await this._datastore.updateAsync(
            { _id: id },
            { $set: data },
            {
                returnUpdatedDocs: true
            }
        )).affectedDocuments;

        const sites = [...this._sites];
        const index = sites.findIndex((site) => site._id === id);

        if (index < 0) return Promise.reject();

        sites[index] = doc as unknown as Required<SitePermissionData | SiteContentData | SiteContentCookieData | SiteContentZoomLevelData>;
        this._sites = sites;

        return doc;
    }
}

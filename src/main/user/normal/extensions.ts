import { Extension } from 'electron';
import { mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { getUserDataPath } from '../../../utils/path';
import { IExtensions, IUser } from '../../interfaces/user';

export class NormalExtensions implements IExtensions {

    public readonly user: IUser;

    public readonly path: string;

    public constructor(user: IUser) {
        this.user = user;

        this.path = getUserDataPath(user.id, 'Extensions');
        mkdir(this.path, { recursive: true });
    }

    public async load(id: string): Promise<Extension | undefined> {
        const directory = await this.getDirectory(id);
        if (!directory)
            return undefined;

        return await this.user.session.session.loadExtension(directory);
    }

    public unload(id: string) {
        this.user.session.session.removeExtension(id);
    }

    public async loads() {
        try {
            const subDirectories = await readdir(this.path, {
                withFileTypes: true
            });

            const extensionDirectories = await Promise.all(
                subDirectories
                    .filter((dirEnt) => dirEnt.isDirectory())
                    .map(async (dirEnt) => await this.getDirectory(dirEnt.name))
            );

            const results = [];

            for (const extPath of extensionDirectories.filter(Boolean)) {
                if (typeof extPath !== 'string') continue;
                console.log(`Loading extension from ${extPath}`);
                try {
                    const extensionInfo = await this.user.session.session.loadExtension(extPath);
                    results.push(extensionInfo);
                } catch (e) {
                    console.error(e);
                }
            }

            return results;
        } catch {
            return [];
        }
    }

    private async existsManifest(dirPath: string | undefined) {
        if (!dirPath)
            return false;

        const manifestPath = join(dirPath, 'manifest.json');
        try {
            return (await stat(manifestPath)).isFile();
        } catch {
            return false;
        }
    }

    private async getDirectory(id: string): Promise<string | undefined> {
        const extPath = join(this.path, id);

        if (await this.existsManifest(extPath))
            return extPath;

        const extSubDirs = await readdir(extPath, {
            withFileTypes: true
        });

        const versionDirPath =
            extSubDirs.length === 1 && extSubDirs[0].isDirectory()
                ? join(extPath, extSubDirs[0].name)
                : undefined;

        if (await this.existsManifest(versionDirPath))
            return versionDirPath;
    }
}

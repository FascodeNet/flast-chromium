import { app, Session } from 'electron';
import { mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { IExtensions, IUser } from '../interfaces';

export class NormalExtensions implements IExtensions {

    readonly user: IUser;

    public readonly path: string;

    constructor(user: IUser) {
        this.user = user;

        this.path = join(app.getPath('userData'), 'users', user.id, 'extensions');

        mkdir(this.path, { recursive: true });
    }

    public async loads(ses: Session) {
        const manifestExists = async (dirPath: string | undefined) => {
            if (!dirPath)
                return false;

            const manifestPath = join(dirPath, 'manifest.json');
            try {
                return (await stat(manifestPath)).isFile();
            } catch {
                return false;
            }
        };

        const subDirectories = await readdir(this.path, {
            withFileTypes: true
        });

        const extensionDirectories = await Promise.all(
            subDirectories
                .filter((dirEnt) => dirEnt.isDirectory())
                .map(async (dirEnt) => {
                    const extPath = join(this.path, dirEnt.name);

                    if (await manifestExists(extPath))
                        return extPath;

                    const extSubDirs = await readdir(extPath, {
                        withFileTypes: true
                    });

                    const versionDirPath =
                        extSubDirs.length === 1 && extSubDirs[0].isDirectory()
                            ? join(extPath, extSubDirs[0].name)
                            : undefined;

                    if (await manifestExists(versionDirPath))
                        return versionDirPath;
                })
        );

        const results = [];

        for (const extPath of extensionDirectories.filter(Boolean)) {
            if (typeof extPath !== 'string') continue;
            console.log(`Loading extension from ${extPath}`);
            try {
                const extensionInfo = await ses.loadExtension(extPath);
                results.push(extensionInfo);
            } catch (e) {
                console.error(e);
            }
        }

        return results;
    }
}

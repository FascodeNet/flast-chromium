import { readFile } from 'fs/promises';
import { AppearanceInternalTheme, AppearanceTheme, ThemeManifest } from '../../interfaces/user';
import { getStylesPath, getUserDataPath } from '../../utils/path';
import { IUser } from '../interfaces/user';

export class ThemeData {

    public readonly user: IUser;

    public readonly themePath?: string;
    public readonly manifestPath?: string;

    private readonly _theme: AppearanceTheme;
    private _manifest?: ThemeManifest;

    public constructor(user: IUser, theme: AppearanceTheme) {
        this.user = user;

        if (theme) {
            this.themePath = this.isInternalTheme(theme) ? getStylesPath(theme, 'theme.css') : getUserDataPath(this.user.id, theme, 'theme.css');
            this.manifestPath = this.isInternalTheme(theme) ? getStylesPath(theme, 'manifest.json') : getUserDataPath(this.user.id, theme, 'manifest.json');
        }

        this._theme = theme;
        this.getManifest().then((themeManifest) => this._manifest = themeManifest).catch(() => {
            if (theme)
                Promise.reject('Invalid Theme Manifest!');
        });
    }

    public get theme() {
        return this._theme;
    }

    public get manifest() {
        return this._manifest;
    }

    public isInternalTheme(appearanceTheme: AppearanceTheme): appearanceTheme is AppearanceInternalTheme {
        return true;
    }

    private async getManifest() {
        if (!this.manifestPath)
            return Promise.reject('Theme Manifest not found!');

        try {
            return JSON.parse(await readFile(this.manifestPath, 'utf8')) as ThemeManifest;
        } catch {
            return Promise.reject('Theme Manifest not found!');
        }
    }
}

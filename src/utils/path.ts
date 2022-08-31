import { join } from 'path';

// tslint:disable-next-line:no-var-requires
const app = process.type === 'browser' ? require('electron').app : require('@electron/remote').app;

export const getBuildPath = (directory: 'preloads' | 'browser' | 'pages', ...paths: string[]) => join(__dirname, directory, ...paths);
export const getStaticPath = (...paths: string[]) => join(app.getAppPath(), 'static', ...paths);
export const getIconsPath = (...paths: string[]) => getStaticPath('icons', ...paths);
export const getStylesPath = (...paths: string[]) => getStaticPath('styles', ...paths);
export const getSpecialPath = (
    name: 'home' | 'appData' | 'userData' | 'cache' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps',
    ...paths: string[]
) => join(app.getPath(name), ...paths);
export const getUserDataPath = (userId: string, ...paths: string[]) => getSpecialPath('userData', 'users', userId, ...paths);

import { BrowserWindow, ipcMain, nativeImage } from 'electron';
import { IPCChannel } from '../../constants/ipc';
import { getBuildPath, getIconsPath } from '../../utils/path';
import { IS_DEVELOPMENT } from '../../utils/process';
import { WindowImpl } from '../implements/window';

export class ProcessManagerWindow extends WindowImpl {

    public constructor() {
        super(new BrowserWindow({
            width: 600,
            minWidth: 500,
            height: 550,
            minHeight: 450,
            frame: false,
            show: false,
            titleBarStyle: 'hiddenInset',
            trafficLightPosition: {
                x: 15,
                y: 13
            },
            backgroundColor: '#ffffff',
            title: 'Process Manager',
            icon: nativeImage.createFromPath(getIconsPath('app', 'icon.png')),
            webPreferences: {
                // preload: buildDirectory('preloads', 'window.js'),
                nodeIntegration: true,
                contextIsolation: false,
                sandbox: false,
                plugins: true,
                javascript: true
            }
        }));

        this.setListeners();
        this.setupIpc();

        this.browserWindow.setMenu(null);

        this.browserWindow.loadFile(getBuildPath('browser', 'process-manager.html'));

        if (IS_DEVELOPMENT)
            this.browserWindow.removeMenu();

        this.webContents.once('dom-ready', () => {
            if (!IS_DEVELOPMENT) return;

            // 開発モードの場合はデベロッパーツールを開く
            this.browserWindow.webContents.openDevTools({ mode: 'detach' });
        });
    }

    private setListeners() {

    }

    private setupIpc() {
        ipcMain.handle(IPCChannel.Window.CLOSE(this.id), () => {
            this.browserWindow.close();
        });
    }
}

import { app, ipcMain, Session, WebContents } from 'electron';
import { readFile, rename, writeFile } from 'fs/promises';
import { customAlphabet } from 'nanoid';
import { join, resolve } from 'path';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_DOWNLOADS } from '../../constants';
import { DIALOG_DOWNLOADS_NAME } from '../../constants/dialog';
import { IPCChannel } from '../../constants/ipc';
import { DownloadData, OmitData } from '../../interfaces/user';
import { getSpecialPath } from '../../utils/path';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { NormalUser } from '../user/normal';
import { parseCrx } from '../utils/extension';
import { existsPath, extractZip } from '../utils/file';

interface DownloadAction {
    id: string;
    url: string;
    action: 'open' | 'save' | 'save_as';
}

export const registerDownloadListener = (session: Session, user: IUser) => {
    const downloads = user.downloads;

    const actions: DownloadAction[] = [];

    const sendUpdatedData = (webContents: WebContents, data: Required<DownloadData>) => {
        const dynamicDialog = Main.dialogManager.getDynamic(DIALOG_DOWNLOADS_NAME);
        if (dynamicDialog) {
            dynamicDialog.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);
        } else {
            for (const window of Main.windowManager.getWindows(user)) {
                window.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);

                for (const view of window.viewManager.views.filter((appView) => appView.url.startsWith(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`))) {
                    view.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);
                }
            }
        }
    };

    session.on('will-download', async (e, item, webContents) => {
        const config = user.settings.config;

        const isExtension = item.getMimeType() === 'application/x-chrome-extension';

        const action = actions.find((downloadAction) => downloadAction.url === item.getURL());
        if (action) {
            switch (action.action) {
                case 'open':
                    item.setSavePath(getSpecialPath('temp', item.getFilename()));
                    break;
                case 'save':
                    item.setSavePath(join(config.download.path, item.getFilename()));
                    break;
                case 'save_as':
                    break;
            }
        } else {
            if (user instanceof NormalUser && isExtension) {
                item.setSavePath(join(user.extensions.path, item.getFilename()));
            } else if (config.download.check_operation_every) {
                e.preventDefault();

                const url = item.getURL();
                const waitingData = await downloads.add({
                    name: item.getFilename(),
                    url: item.getURL(),
                    path: item.getSavePath(),
                    mimeType: item.getMimeType(),
                    totalBytes: item.getTotalBytes(),
                    receivedBytes: item.getReceivedBytes(),
                    isPaused: item.isPaused(),
                    canResume: item.canResume(),
                    state: 'waiting'
                });

                sendUpdatedData(webContents, waitingData);

                ipcMain.handleOnce(IPCChannel.Downloads.ACTION_OPEN(waitingData._id), () => {
                    actions.push({ id: waitingData._id, url, action: 'open' });
                    session.downloadURL(url);
                });
                ipcMain.handleOnce(IPCChannel.Downloads.ACTION_SAVE(waitingData._id), () => {
                    actions.push({ id: waitingData._id, url, action: 'save' });
                    session.downloadURL(url);
                });
                ipcMain.handleOnce(IPCChannel.Downloads.ACTION_SAVE_AS(waitingData._id), () => {
                    actions.push({ id: waitingData._id, url, action: 'save_as' });
                    session.downloadURL(url);
                });
                ipcMain.handleOnce(IPCChannel.Downloads.ACTION_CANCEL(waitingData._id), async () => {
                    await downloads.update(waitingData._id, {
                        state: 'cancelled'
                    });
                });

                return;
            } else if (!config.download.check_path_every) {
                item.setSavePath(join(config.download.path, item.getFilename()));
            }
        }

        const initialData: OmitData<DownloadData> = {
            name: item.getFilename(),
            url: item.getURL(),
            path: item.getSavePath(),
            mimeType: item.getMimeType(),
            totalBytes: item.getTotalBytes(),
            receivedBytes: item.getReceivedBytes(),
            isPaused: item.isPaused(),
            canResume: item.canResume(),
            state: item.getState()
        };

        const data = action ? await downloads.update(action.id, initialData) : await downloads.add(initialData);

        user.session.downloadItems.set(data._id, item);

        item.on('updated', async (event, state) => {
            const icon = await app.getFileIcon(item.getSavePath());
            const downloadData = await downloads.update(data._id, {
                path: item.getSavePath(),
                icon: icon.toDataURL(),
                totalBytes: item.getTotalBytes(),
                receivedBytes: item.getReceivedBytes(),
                isPaused: item.isPaused(),
                canResume: item.canResume(),
                state
            });

            user.session.downloadItems.set(data._id, item);

            sendUpdatedData(webContents, downloadData);
        });
        item.once('done', async (event, state) => {
            const icon = await app.getFileIcon(item.getSavePath());
            const downloadData = await downloads.update(data._id, {
                path: item.getSavePath(),
                icon: icon.toDataURL(),
                totalBytes: item.getTotalBytes(),
                receivedBytes: item.getReceivedBytes(),
                isPaused: item.isPaused(),
                canResume: item.canResume(),
                state
            });

            user.session.downloadItems.set(data._id, item);

            sendUpdatedData(webContents, downloadData);

            if (state === 'completed' && user instanceof NormalUser && isExtension) {
                const crxBuf = await readFile(item.getSavePath());
                const crxInfo = parseCrx(crxBuf);

                if (!crxInfo.id)
                    crxInfo.id = customAlphabet('abcdefghijklmnopqrstuvwxyz', 32)();

                const extensionsPath = user.extensions.path;
                const path = resolve(extensionsPath, crxInfo.id);
                const manifestPath = resolve(path, 'manifest.json');

                if (await existsPath(path)) {
                    console.log('Extension is already installed');
                    return;
                }

                await extractZip(crxInfo.zip, path);
                await rename(item.getSavePath(), join(extensionsPath, `${crxInfo.id}.crx`));

                const extension = await user.extensions.load(crxInfo.id);

                if (crxInfo.publicKey) {
                    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

                    manifest.key = crxInfo.publicKey.toString('base64');

                    await writeFile(
                        manifestPath,
                        JSON.stringify(manifest, null, 2)
                    );
                }
            }
        });
    });
};

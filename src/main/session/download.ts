import { app, Session, WebContents } from 'electron';
import { readFile, rename, writeFile } from 'fs/promises';
import { customAlphabet } from 'nanoid';
import { join, resolve } from 'path';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_DOWNLOADS } from '../../constants';
import { DIALOG_DOWNLOADS_NAME } from '../../constants/dialog';
import { IPCChannel } from '../../constants/ipc';
import { DownloadData } from '../../interfaces/user';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { NormalUser } from '../user/normal';
import { parseCrx } from '../utils/extension';
import { existsPath, extractZip } from '../utils/file';

export const registerDownloadListener = (session: Session, user: IUser) => {
    const downloads = user.downloads;

    const sendUpdatedData = (webContents: WebContents, data: Required<DownloadData>) => {
        const dynamicDialog = Main.dialogManager.getDynamic(DIALOG_DOWNLOADS_NAME);
        if (dynamicDialog) {
            dynamicDialog.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);
        } else {
            const window = Main.windowManager.getWindows(user).find((appWindow) => appWindow.viewManager.get(webContents.id));
            if (!window) return;

            const view = window.viewManager.views.find((appView) => appView.url.startsWith(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`));
            if (view) {
                view.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);
            } else {
                window.webContents.send(IPCChannel.Downloads.UPDATED(data._id), data);
            }
        }
    };

    session.on('will-download', async (e, item, webContents) => {
        const isExtension = item.getMimeType() === 'application/x-chrome-extension';
        if (user instanceof NormalUser && isExtension)
            item.setSavePath(join(user.extensions.path, item.getFilename()));

        const data = await downloads.add({
            name: item.getFilename(),
            url: item.getURL(),
            path: item.getSavePath(),
            mimeType: item.getMimeType(),
            totalBytes: item.getTotalBytes(),
            receivedBytes: item.getReceivedBytes(),
            isPaused: item.isPaused(),
            canResume: item.canResume(),
            state: item.getState()
        });

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

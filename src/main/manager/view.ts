import { ipcMain, webContents } from 'electron';
import { MoveDirection } from '../../interfaces/view';
import { nonNullable } from '../../utils/array';
import { Main } from '../main';
import { getTabMenu } from '../menus/view';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';

export class ViewManager {
    public views = new Map<number, AppView>();

    public sortOrders: number[] = [];

    private _selectedId: number = -1;

    public readonly window: AppWindow;
    public readonly incognito: boolean = false;

    public constructor(window: AppWindow, incognito: boolean) {
        this.window = window;
        this.incognito = incognito;
        this.setupIpc();
    }

    public get selectedId() {
        return this._selectedId;
    }

    public getViews(): AppView[] {
        return this.sortOrders.map((id) => this.get(id)).filter(nonNullable).filter((view: AppView) => !view.webContents.isDestroyed());
    }

    public getLeftViews(id: number) {
        const views = this.getViews();
        const viewIndex = views.findIndex((view) => view.id === id);

        return views.slice(0, viewIndex);
    }

    public getRightViews(id: number) {
        const views = this.getViews();
        const viewIndex = views.findIndex((view) => view.id === id);

        return views.slice(viewIndex + 1);
    }

    public get(id: number = this._selectedId) {
        return this.views.get(id ?? this._selectedId);
    }

    public add(url: string = 'https://www.google.com', active: boolean = true) {
        const view = new AppView(
            this.window,
            {
                url: url ?? 'https://www.google.com',
                incognito: this.incognito,
                active: active ?? true
            }
        );

        this.views.set(view.id, view);
        this.sortOrders.push(view.id);

        webContents.getAllWebContents().forEach((webContents) => webContents.send(`view-${this.window.id}`, view.state));
        if (active)
            this.selectOf(view);

        return view;
    }

    public remove(id: number = this._selectedId) {
        const view = this.views.get(id);
        const sortedViewIndex = this.getViews().findIndex((view) => view.id === id);

        if (!view) return;

        this.removeOf(view);

        const sortedViews = this.getViews();
        if (sortedViews.length > 0) {
            // 削除したタブのIDと現在選択されているタブのIDが一致しているか
            if (this._selectedId === id && sortedViewIndex !== -1) {
                // タブが最後に配置されていないか
                if (sortedViewIndex < (sortedViews.length - 1)) {
                    // 次のタブにフォーカスを合わせる
                    this.selectOf(sortedViews[sortedViewIndex + 1]);
                } else {
                    // 前のタブにフォーカスを合わせる
                    this.selectOf(sortedViews[sortedViewIndex - 1]);
                }
            }
        } else {
            this.window.browserWindow.destroy();
            this.window.browserWindow.close();
        }

        this.updateViews();
    }

    public removeOthers(id: number = this._selectedId) {
        const views = this.getViews().filter((view) => view.id !== id);
        views.forEach((view) => this.removeOf(view));

        this.updateViews();
    }

    public removeLefts(id: number = this._selectedId) {
        const views = this.getViews();
        const viewIndex = views.findIndex((view) => view.id === id);
        const selectedViewIndex = views.findIndex((view) => view.id === this._selectedId);

        this.getLeftViews(id).forEach((view) => this.removeOf(view));

        if (selectedViewIndex < viewIndex)
            this.selectOf(views[viewIndex]);

        this.updateViews();
    }

    public removeRights(id: number = this._selectedId) {
        const views = this.getViews();
        const viewIndex = views.findIndex((view) => view.id === id);
        const selectedViewIndex = views.findIndex((view) => view.id === this._selectedId);

        this.getRightViews(id).forEach((view) => this.removeOf(view));

        if (selectedViewIndex > viewIndex)
            this.selectOf(views[viewIndex]);

        this.updateViews();
    }

    private removeOf(view: AppView) {
        this.views.delete(view.id);
        this.sortOrders = this.sortOrders.filter((sortId) => sortId !== view.id);

        if (view && !view.webContents.isDestroyed()) {
            // @ts-ignore
            view.webContents.destroy();
            this.window.browserWindow.removeBrowserView(view.browserView);
        }
    }

    public select(id: number) {
        const view = this.views.get(id);
        if (!view) return;
        this.selectOf(view);
    }

    private selectOf(view: AppView) {
        if (!view || view.webContents && view.webContents.isDestroyed()) {
            this.views.delete(view.id);
            return;
        }

        this.replaceView(view);

        this._selectedId = view.id;
        view.setWindowTitle();
        view.setBounds();

        if (view.user.type === 'normal')
            view.user.session.extensions.selectTab(view.webContents);

        webContents.getAllWebContents().forEach((webContents) => webContents.send(`view-select-${this.window.id}`, view.id));
        webContents.getAllWebContents().forEach((webContents) => webContents.send(`view-${this.window.id}`, view.state));
        this.updateViews();
    }

    public moveTo(id: number, toIndex: number) {
        const filtered = this.sortOrders.filter((sortId) => sortId !== id);
        filtered.splice(toIndex, 0, id);
        this.sortOrders = filtered;

        this.updateViews();
    }

    public moveToDirection(id: number, direction: MoveDirection) {
        const index = this.sortOrders.findIndex((sortId) => sortId === id);

        // 端に行くことを防ぐ
        if (index === 0 && direction === 'start' || index === (this.sortOrders.length - 1) && direction === 'end') return;

        const filtered = this.sortOrders.filter((sortId) => sortId !== id);
        filtered.splice(direction === 'start' ? index - 1 : index + 1, 0, id);
        this.sortOrders = filtered;

        this.updateViews();
    }

    public clear() {
        [...this.views.values()].forEach((view) => {
            if (view && !view.webContents.isDestroyed()) {
                // @ts-ignore
                view.webContents.destroy();
                this.window.browserWindow.removeBrowserView(view.browserView);
            }
        });
        this.views.clear();
    }


    private setupIpc() {
        const id = this.window.id;
        ipcMain.handle(`views-${id}`, () => {
            return this.getViews().map((view) => view.state);
        });
        ipcMain.handle(`view-${id}`, (e, id: number) => {
            const view = this.views.get(id);
            if (!view) return undefined;
            return view.state;
        });
        ipcMain.handle(`view-current-${id}`, () => {
            const view = this.views.get(this._selectedId);
            if (!view) return undefined;
            return view.state;
        });
        ipcMain.handle(`view-create-${id}`, (e, url: string, active) => {
            const view = this.add(url, active);
            return view.id;
        });
        ipcMain.handle(`view-destroy-${id}`, (e, id: number) => {
            this.remove(id);
        });
        ipcMain.handle(`view-select-${id}`, (e, id: number) => {
            this.select(id);
        });
        ipcMain.handle(`view-move-${id}`, (e, id: number, toIndex: number) => {
            this.moveTo(id, toIndex);
        });
        ipcMain.handle(`view-move_direction-${id}`, (e, id: number, direction: MoveDirection) => {
            this.moveToDirection(id, direction);
        });
        ipcMain.handle(`view-menu-${id}`, (e, id: number, x: number, y: number) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            const menu = getTabMenu(this.window, view);
            menu.popup({ window: this.window.browserWindow, x, y });
        });

        ipcMain.handle(`view-back-${id}`, (e, id: number) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.back();
        });
        ipcMain.handle(`view-forward-${id}`, (e, id: number) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.forward();
        });
        ipcMain.handle(`view-reload-${id}`, (e, id: number) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.reload();
        });
        ipcMain.handle(`view-stop-${id}`, (e, id: number) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.stop();
        });
        ipcMain.handle(`view-load-${this.window.id}`, (e, id: number, url: string) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.load(url);
        });

        ipcMain.handle(`view-find_in_page-${this.window.id}`, (e, id: number, text: string, matchCase: boolean) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            view.findInPage(text, matchCase);
            return view.findState;
        });
        ipcMain.handle(`view-move_find_in_page-${this.window.id}`, (e, id: number, forward: boolean) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            view.moveFindInPage(forward);
            return view.findState;
        });
        ipcMain.handle(`view-stop_find_in_page-${this.window.id}`, (e, id: number, hide: boolean) => {
            const view = this.views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            view.stopFindInPage();
            if (hide && view.findDialog) {
                Main.dialogManager.destroy(view.findDialog);
                view.findDialog = undefined;
            }
        });
    }

    private updateViews() {
        this.window.setApplicationMenu();
        this.window.setTouchBar();
        this.window.browserWindow.webContents.send(
            `views-${this.window.id}`,
            this.getViews().map((view) => view.state)
        );
    }

    private replaceView(view: AppView) {
        const selected = this.get();
        if (selected)
            this.window.browserWindow.removeBrowserView(selected.browserView);

        this.window.browserWindow.addBrowserView(view.browserView);
    }
}

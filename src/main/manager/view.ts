import { ipcMain } from 'electron';
import { MoveDirection } from '../../interfaces/view';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../utils';
import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { Main } from '../main';
import { getTabMenu } from '../menus/view';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';

export class ViewManager {

    private _selectedId: number = -1;

    private _views = new Map<number, AppView>();
    private _sortOrders: number[] = [];

    public readonly window: AppWindow;
    public readonly incognito: boolean;

    public readonly user: IUser;

    public constructor(window: AppWindow) {
        this.window = window;
        this.incognito = window.incognito;

        this.user = window.user;

        this.setupIpc();
    }

    public get selectedId() {
        return this._selectedId;
    }

    public get views(): AppView[] {
        return this._sortOrders.map((id) => this.get(id)).filter(nonNullable).filter((view: AppView) => !view.webContents.isDestroyed());
    }

    public get sortOrders() {
        return this._sortOrders;
    }

    public getLeftViews(id: number) {
        const views = this.views;
        const viewIndex = views.findIndex((view) => view.id === id);

        return views.slice(0, viewIndex);
    }

    public getRightViews(id: number) {
        const views = this.views;
        const viewIndex = views.findIndex((view) => view.id === id);

        return views.slice(viewIndex + 1);
    }

    public get(id: number = this._selectedId) {
        return this._views.get(id ?? this._selectedId);
    }

    public add(url: string = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`, active: boolean = true) {
        const view = new AppView(
            this.window,
            {
                url: url ?? `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`,
                active: active ?? true
            }
        );

        this._views.set(view.id, view);
        this._sortOrders.push(view.id);

        view.updateView();
        this.updateViews();

        if (active)
            this.selectOf(view);

        return view;
    }

    public remove(id: number = this._selectedId) {
        const view = this._views.get(id);
        if (!view) return;

        const sortedViews = this.views;
        const sortedViewIndex = sortedViews.findIndex((appView) => appView.id === id);

        this.removeOf(view);

        if (sortedViews.length > 1) {
            // 削除したタブのIDと現在選択されているタブのIDが一致しているか
            if (this._selectedId === id && sortedViewIndex !== -1) {
                // 最後のタブのインデックス
                const lastIndex = sortedViews.length - 1;
                // 選択されていたタブが最後かどうか
                if (sortedViewIndex === lastIndex) {
                    // 前のタブにフォーカスを合わせる
                    this.selectOf(sortedViews[sortedViewIndex - 1]);
                } else {
                    // 次のタブにフォーカスを合わせる
                    this.selectOf(sortedViews[sortedViewIndex + 1]);
                }
            }
        } else {
            this.window.browserWindow.destroy();
            this.window.browserWindow.close();
        }

        this.updateViews();
    }

    public removeOthers(id: number = this._selectedId) {
        const views = this.views.filter((view) => view.id !== id);
        views.forEach((view) => this.removeOf(view));

        this.updateViews();
    }

    public removeLefts(id: number = this._selectedId) {
        const views = this.views;
        const viewIndex = views.findIndex((view) => view.id === id);
        const selectedViewIndex = views.findIndex((view) => view.id === this._selectedId);

        this.getLeftViews(id).forEach((view) => this.removeOf(view));

        if (selectedViewIndex < viewIndex)
            this.selectOf(views[viewIndex]);

        this.updateViews();
    }

    public removeRights(id: number = this._selectedId) {
        const views = this.views;
        const viewIndex = views.findIndex((view) => view.id === id);
        const selectedViewIndex = views.findIndex((view) => view.id === this._selectedId);

        this.getRightViews(id).forEach((view) => this.removeOf(view));

        if (selectedViewIndex > viewIndex)
            this.selectOf(views[viewIndex]);

        this.updateViews();
    }

    private removeOf(view: AppView) {
        this._views.delete(view.id);
        this._sortOrders = this._sortOrders.filter((sortId) => sortId !== view.id);

        if (view.webContents && !view.webContents.isDestroyed()) {
            // @ts-ignore
            view.webContents.destroy();
            this.window.browserWindow.removeBrowserView(view.browserView);
        }
    }

    public select(id: number) {
        const view = this._views.get(id);
        if (!view) return;
        this.selectOf(view);
    }

    private selectOf(view: AppView) {
        if (!view) return;
        if (view.webContents && view.webContents.isDestroyed()) {
            this._views.delete(view.id);
            return;
        }

        this.replaceView(view);

        this._selectedId = view.id;
        view.setWindowTitle();
        view.setBounds();

        if (view.user.type === 'normal')
            view.user.session.extensions.selectTab(view.webContents);

        this.window.webContents.send(`view-select-${this.window.id}`, view.id);
        view.updateView();
        this.updateViews();
    }

    public moveTo(id: number, toIndex: number) {
        const filtered = this._sortOrders.filter((sortId) => sortId !== id);
        filtered.splice(toIndex, 0, id);
        this._sortOrders = filtered;

        this.updateViews();
    }

    public moveToDirection(id: number, direction: MoveDirection) {
        const index = this._sortOrders.findIndex((sortId) => sortId === id);

        const view = this.get(id);
        if (!view) return;

        const pinnedViews = this.views.filter((appView) => appView.pinned);
        // 端からはみ出すことを防ぐ
        if (view.pinned) {
            if (index === 0 && direction === 'start' || index === (pinnedViews.length - 1) && direction === 'end')
                return;
        } else {
            if (index === pinnedViews.length && direction === 'start' || index === (this._sortOrders.length - 1) && direction === 'end')
                return;
        }

        const filtered = this._sortOrders.filter((sortId) => sortId !== id);
        filtered.splice(direction === 'start' ? index - 1 : index + 1, 0, id);
        this._sortOrders = filtered;

        this.updateViews();
    }

    public clear() {
        [...this._views.values()].forEach((view) => {
            if (view && !view.webContents.isDestroyed()) {
                // @ts-ignore
                view.webContents.destroy();
                this.window.browserWindow.removeBrowserView(view.browserView);
            }
        });
        this._views.clear();
    }


    private setupIpc() {
        const windowId = this.window.id;
        ipcMain.handle(`views-${windowId}`, () => {
            return this.views.map((view) => view.state);
        });
        ipcMain.handle(`view-${windowId}`, (e, id: number) => {
            const view = this._views.get(id);
            if (!view) return undefined;
            return view.state;
        });
        ipcMain.handle(`view-current-${windowId}`, () => {
            const view = this._views.get(this._selectedId);
            if (!view) return undefined;
            return view.state;
        });
        ipcMain.handle(`view-create-${windowId}`, (e, url: string, active) => {
            const view = this.add(url, active);
            return view.id;
        });
        ipcMain.handle(`view-destroy-${windowId}`, (e, id: number) => {
            this.remove(id);
        });
        ipcMain.handle(`view-select-${windowId}`, (e, id: number) => {
            this.select(id);
        });
        ipcMain.handle(`view-move-${windowId}`, (e, id: number, toIndex: number) => {
            this.moveTo(id, toIndex);
        });
        ipcMain.handle(`view-move_direction-${windowId}`, (e, id: number, direction: MoveDirection) => {
            this.moveToDirection(id, direction);
        });
        ipcMain.handle(`view-menu-${windowId}`, (e, id: number, x: number, y: number) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            const menu = getTabMenu(this.window, view);
            menu.popup({ window: this.window.browserWindow, x, y });
        });

        ipcMain.handle(`view-back-${windowId}`, (e, id: number) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.back();
        });
        ipcMain.handle(`view-forward-${windowId}`, (e, id: number) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.forward();
        });
        ipcMain.handle(`view-reload-${windowId}`, (e, id: number) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.reload();
        });
        ipcMain.handle(`view-stop-${windowId}`, (e, id: number) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.stop();
        });
        ipcMain.handle(`view-load-${windowId}`, (e, id: number, url: string) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;
            view.load(url);
        });

        ipcMain.handle(`view-find_in_page-${windowId}`, (e, id: number, text: string, matchCase: boolean) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            view.findInPage(text, matchCase);
            return view.findState;
        });
        ipcMain.handle(`view-move_find_in_page-${windowId}`, (e, id: number, forward: boolean) => {
            const view = this._views.get(id);
            if (!view || view.webContents.isDestroyed()) return;

            view.moveFindInPage(forward);
            return view.findState;
        });
        ipcMain.handle(`view-stop_find_in_page-${windowId}`, (e, id: number, hide: boolean) => {
            const view = this._views.get(id);
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
        this.window.webContents.send(
            `views-${this.window.id}`,
            this.views.map((view) => view.state)
        );
    }

    private replaceView(view: AppView) {
        const selected = this.get();
        if (selected)
            this.window.browserWindow.removeBrowserView(selected.browserView);

        this.window.browserWindow.addBrowserView(view.browserView);
    }
}

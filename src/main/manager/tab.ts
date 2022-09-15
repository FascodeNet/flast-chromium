import { ipcMain } from 'electron';
import { ExtensionStore } from 'electron-chrome-extensions-production/dist/browser/store';
import { APPLICATION_PROTOCOL, APPLICATION_WEB_HOME } from '../../constants';
import { IPCChannel } from '../../constants/ipc';
import { MoveDirection } from '../../interfaces/view';
import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { NormalUser } from '../user/normal';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';
import { ViewManager } from './view';

export class TabManager {

    public readonly user: IUser;

    public readonly window: AppWindow;
    public readonly incognito: boolean;

    private _selectedId: number = -1;
    public _sortOrders: number[] = [];

    public constructor(window: AppWindow) {
        this.user = window.user;

        this.window = window;
        this.incognito = window.incognito;

        this.handleIpc();
    }

    public get viewManager(): ViewManager {
        return this.user.viewManager;
    }

    public get selectedId() {
        return this._selectedId;
    }

    public get sortOrders() {
        return this._sortOrders;
    }

    public get tabs(): AppView[] {
        return this._sortOrders.map((id) => this.get(id)).filter(nonNullable).filter((view: AppView) => !view.webContents.isDestroyed());
    }

    public getLeftTabs(id: number) {
        const tabs = this.tabs;
        const tabIndex = tabs.findIndex((view) => view.id === id);

        return tabs.slice(0, tabIndex);
    }

    public getRightTabs(id: number) {
        const tabs = this.tabs;
        const tabIndex = tabs.findIndex((view) => view.id === id);

        return tabs.slice(tabIndex + 1);
    }

    public get(id: number = this._selectedId) {
        return this.viewManager.get(id ?? this._selectedId, this.window);
    }

    public add(url: string = `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`, active: boolean = true) {
        const view = new AppView(
            this.window,
            {
                url: url ?? `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`,
                active: active ?? true
            }
        );

        this.viewManager.set(view.id, view);
        this._sortOrders.push(view.id);

        view.updateView();
        this.updateViews();

        if (active)
            this.selectOf(view);

        return view;
    }

    public remove(id: number = this._selectedId) {
        const view = this.get(id);
        if (!view) return;

        const sortedTabs = this.tabs;
        const sortedTabIndex = sortedTabs.findIndex((appView) => appView.id === id);

        this.removeOf(view);

        if (sortedTabs.length > 1) {
            // 削除したタブのIDと現在選択されているタブのIDが一致しているか
            if (this._selectedId === id && sortedTabIndex !== -1) {
                // 最後のタブのインデックス
                const lastIndex = sortedTabs.length - 1;
                // 選択されていたタブが最後かどうか
                if (sortedTabIndex === lastIndex) {
                    // 前のタブにフォーカスを合わせる
                    this.selectOf(sortedTabs[sortedTabIndex - 1]);
                } else {
                    // 次のタブにフォーカスを合わせる
                    this.selectOf(sortedTabs[sortedTabIndex + 1]);
                }
            }
        } else {
            this.window.browserWindow.close();
            this.window.browserWindow.destroy();
        }

        this.updateViews();
    }

    public removeOthers(id: number = this._selectedId) {
        const tabs = this.tabs.filter((view) => view.id !== id);
        tabs.forEach((view) => this.removeOf(view));

        this.updateViews();
    }

    public removeLefts(id: number = this._selectedId) {
        const tabs = this.tabs;
        const tabIndex = tabs.findIndex((view) => view.id === id);
        const selectedTabIndex = tabs.findIndex((view) => view.id === this._selectedId);

        this.getLeftTabs(id).forEach((view) => this.removeOf(view));

        if (selectedTabIndex < tabIndex)
            this.selectOf(tabs[tabIndex]);

        this.updateViews();
    }

    public removeRights(id: number = this._selectedId) {
        const tabs = this.tabs;
        const tabIndex = tabs.findIndex((view) => view.id === id);
        const selectedTabIndex = tabs.findIndex((view) => view.id === this._selectedId);

        this.getRightTabs(id).forEach((view) => this.removeOf(view));

        if (selectedTabIndex > tabIndex)
            this.selectOf(tabs[tabIndex]);

        this.updateViews();
    }

    private removeOf(view: AppView) {
        this.viewManager.delete(view);
        this._sortOrders = this._sortOrders.filter((sortId) => sortId !== view.id);

        if (view.webContents && !view.webContents.isDestroyed()) {
            // @ts-ignore
            view.webContents.destroy();
            this.window.browserWindow.removeBrowserView(view.browserView);
        }
    }

    public select(view: AppView | number) {
        if (view instanceof AppView) {
            if (!view) return;
            this.selectOf(view);
        } else {
            const appView = this.get(view);
            if (!appView) return;
            this.selectOf(appView);
        }
    }

    private selectOf(view: AppView) {
        if (!view) return;
        if (!view.webContents || view.webContents.isDestroyed()) {
            this.viewManager.delete(view);
            return;
        }

        this.replaceView(view);

        this._selectedId = view.id;
        view.setWindowTitle();
        view.setBounds();
        view.webContents.focus();

        if (view.user instanceof NormalUser) {
            const store: ExtensionStore = (this.user.session.extensions as any).ctx.store;
            store.tabToWindow.set(view.webContents, view.window.browserWindow);
            store.windows.add(view.window.browserWindow);

            view.user.session.extensions.selectTab(view.webContents);
        }

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

        const pinnedViews = this.tabs.filter((appView) => appView.pinned);
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
        this.tabs.forEach((view) => {
            if (view && !view.webContents.isDestroyed()) {
                // @ts-ignore
                view.webContents.destroy();
                this.window.browserWindow.removeBrowserView(view.browserView);
            }
        });
        this.viewManager.clear(this.window);
    }


    public updateViews() {
        if (this.window.isDestroyed) return;

        this.window.setApplicationMenu();
        this.window.setTouchBar();
        this.window.webContents.send(
            `views-${this.window.id}`,
            this.tabs.map((view) => view.state)
        );
    }

    private replaceView(view: AppView) {
        const selected = this.get();

        this.window.browserWindow.addBrowserView(view.browserView);
        this.window.browserWindow.setTopBrowserView(view.browserView);

        if (!this.user.settings.config.system_performance.smooth_tab_switching && selected && selected.id !== view.id)
            this.window.browserWindow.removeBrowserView(selected.browserView);
    }


    private handleIpc() {
        const windowId = this.window.id;
        ipcMain.handle(IPCChannel.Views.LIST(windowId), () => {
            return this.tabs.map((view) => view.state);
        });
        ipcMain.handle(IPCChannel.Views.GET(windowId), (e, id: number) => {
            const view = this.get(id);
            if (!view) return undefined;
            return view.state;
        });
        ipcMain.handle(IPCChannel.Views.GET_CURRENT(windowId), () => {
            const view = this.get(this._selectedId);
            if (!view) return undefined;
            return view.state;
        });

        ipcMain.handle(IPCChannel.Views.ADD(windowId), (e, url: string, active: boolean) => {
            const view = this.add(url, active);
            return view.id;
        });
        ipcMain.handle(IPCChannel.Views.REMOVE(windowId), (e, id: number) => {
            this.remove(id);
        });
        ipcMain.handle(IPCChannel.Views.SELECT(windowId), (e, id: number) => {
            this.select(id);
        });

        ipcMain.handle(IPCChannel.Views.MOVE(windowId), (e, id: number, toIndex: number) => {
            this.moveTo(id, toIndex);
        });
        ipcMain.handle(IPCChannel.Views.MOVE_DIRECTION(windowId), (e, id: number, direction: MoveDirection) => {
            this.moveToDirection(id, direction);
        });
    }
}

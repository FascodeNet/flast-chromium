import { nonNullable } from '../../utils/array';
import { IUser } from '../interfaces/user';
import { AppView } from '../views/app';
import { AppWindow } from '../windows/app';

/**
 * ユーザー全体のビューを管理するクラス
 */
export class ViewManager {

    public readonly user: IUser;

    private _views = new Map<number, AppView>();

    public constructor(user: IUser) {
        this.user = user;
    }

    public get views(): AppView[] {
        return [...this._views.values()].filter(nonNullable).filter((view: AppView) => !view.webContents.isDestroyed());
    }

    public getViews(window: AppWindow): AppView[] {
        return this.views.filter((view) => view.window.id === window.id);
    }

    public get(id: number, window?: AppWindow): AppView | undefined {
        return (window ? this.getViews(window) : this.views).find((view) => view.id === id);
    }

    public set(id: number, view: AppView) {
        this._views.set(id, view);
    }

    public delete(view: AppView | number) {
        return this._views.delete(view instanceof AppView ? view.id : view);
    }

    public clear(window?: AppWindow) {
        (window ? this.getViews(window) : this.views).forEach((view) => this._views.delete(view.id));
    }
}

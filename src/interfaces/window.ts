export interface WindowFullScreenState {
    /**
     * ユーザーの操作によって全画面表示に移行されたかどうか
     */
    user: boolean;

    /**
     * HTML APIによって全画面表示に移行されたかどうか
     */
    html: boolean;
}


export type WindowStateType = 'normal' | 'minimized' | 'maximized' | 'fullscreen' | 'kiosk';

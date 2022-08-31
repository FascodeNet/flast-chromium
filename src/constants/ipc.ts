const Users = {
    LIST: () => 'users'
} as const;

const User = {
    TYPE: (userId: string) => `user-type-${userId}`,
    GET_CONFIG: (userId: string) => `user-get_config-${userId}`,
    SET_CONFIG: (userId: string) => `user-set_config-${userId}`,
    SET_PROFILE: (userId: string) => `user-set_profile-${userId}`,

    UPDATED_SETTINGS: (userId: string) => `user-updated_settings-${userId}`,
    UPDATED_THEME: (userId: string) => `user-updated_theme-${userId}`
} as const;

const Windows = {
    ADD: () => 'windows-add',
    OPEN_INCOGNITO: () => 'windows-open_incognito'
} as const;

const Window = {
    APPLICATION_MENU: (windowId: number) => `window-application_menu-${windowId}`,
    SIDEBAR: (windowId: number) => `window-sidebar-${windowId}`,

    IS_MINIMIZED: (windowId: number) => `window-is_minimized-${windowId}`,
    IS_MAXIMIZED: (windowId: number) => `window-is_maximized-${windowId}`,
    IS_FULLSCREEN: (windowId: number) => `window-is_fullscreen-${windowId}`,

    MINIMIZE: (windowId: number) => `window-minimize-${windowId}`,
    MAXIMIZE: (windowId: number) => `window-maximize-${windowId}`,
    FULLSCREEN: (windowId: number) => `window-fullscreen-${windowId}`,

    CLOSE: (windowId: number) => `window-close-${windowId}`
} as const;

const Views = {
    LIST: (windowId: number) => `views-${windowId}`,
    GET: (windowId: number) => `views-get-${windowId}`,
    GET_CURRENT: (windowId: number) => `views-get_current-${windowId}`,

    ADD: (windowId: number) => `views-add-${windowId}`,
    REMOVE: (windowId: number) => `views-remove-${windowId}`,
    SELECT: (windowId: number) => `views-select-${windowId}`,

    MOVE: (windowId: number) => `views-move-${windowId}`,
    MOVE_DIRECTION: (windowId: number) => `views-move_direction-${windowId}`
} as const;

const View = {
    TAB_MENU: (viewId: number) => `view-menu-${viewId}`,

    BACK: (viewId: number) => `view-back-${viewId}`,
    FORWARD: (viewId: number) => `view-forward-${viewId}`,
    RELOAD: (viewId: number) => `view-reload-${viewId}`,
    STOP: (viewId: number) => `view-stop-${viewId}`,
    LOAD: (viewId: number) => `view-load-${viewId}`,

    ZOOM_IN: (viewId: number) => `view-zoom_in-${viewId}`,
    ZOOM_OUT: (viewId: number) => `view-zoom_out-${viewId}`,
    ZOOM_RESET: (viewId: number) => `view-zoom_reset-${viewId}`,

    PRINT: (viewId: number) => `view-print-${viewId}`
} as const;

const Dialog = {
    HIDE: (dialogId: number) => `dialog-hide-${dialogId}`,
    DESTROY: (dialogId: number) => `dialog-destroy-${dialogId}`
} as const;


const Popup = {
    WINDOW_MENU: (windowId: number) => `popup-window_menu-${windowId}`,
    PROFILE: (windowId: number) => `popup-profile-${windowId}`,

    SEARCH: (windowId: number) => `popup-search-${windowId}`,

    VIEW_INFORMATION: (windowId: number) => `popup-view_information-${windowId}`,
    VIEW_FIND: (windowId: number) => `popup-view_find-${windowId}`,

    BOOKMARKS: (windowId: number) => `popup-bookmarks-${windowId}`,
    HISTORY: (windowId: number) => `popup-history-${windowId}`,
    DOWNLOADS: (windowId: number) => `popup-downloads-${windowId}`,
    EXTENSIONS: (windowId: number) => `popup-extensions-${windowId}`
} as const;


const Find = {
    START: (viewId: number) => `view-start_find-${viewId}`,
    STOP: (viewId: number) => `view-stop_find-${viewId}`,
    MOVE: (viewId: number) => `view-move_find-${viewId}`
} as const;


const Bookmarks = {
    LIST: (userId: string) => `bookmarks-${userId}`,
    ADD: (userId: string) => `bookmarks-add-${userId}`,
    REMOVE: (userId: string) => `bookmarks-remove-${userId}`,
    UPDATE: (userId: string) => `bookmarks-update-${userId}`
} as const;

const History = {
    LIST: (userId: string) => `history-${userId}`,
    LIST_GROUPS: (userId: string) => `history-groups-${userId}`,
    ADD: (userId: string) => `history-add-${userId}`,
    REMOVE: (userId: string) => `history-remove-${userId}`,
    UPDATE: (userId: string) => `history-update-${userId}`
} as const;

const Downloads = {
    LIST: (userId: string) => `downloads-${userId}`,
    LIST_GROUPS: (userId: string) => `download-groups-${userId}`,

    OPEN_FILE: (userId: string) => `download-open_file-${userId}`,
    OPEN_FOLDER: (userId: string) => `download-open_folder-${userId}`,
    PAUSE: (userId: string) => `download-pause-${userId}`,
    RESUME: (userId: string) => `download-resume-${userId}`,
    CANCEL: (userId: string) => `download-cancel-${userId}`,
    RETRY: (userId: string) => `download-retry-${userId}`,

    ACTION_OPEN: (downloadId: string) => `download-action_open-${downloadId}`,
    ACTION_SAVE: (downloadId: string) => `download-action_save-${downloadId}`,
    ACTION_SAVE_AS: (downloadId: string) => `download-action_save_as-${downloadId}`,
    ACTION_CANCEL: (downloadId: string) => `download-action_cancel-${downloadId}`,

    UPDATED: (downloadId: string) => `download-updated-${downloadId}`
} as const;


export const IPCChannel = {
    Users,
    User,

    Windows,
    Window,
    Views,
    View,
    Dialog,

    Popup,

    Find,

    Bookmarks,
    History,
    Downloads
} as const;

import { UserConfig } from '../interfaces/user';
import { En } from './en';
import { Ja } from './ja';

export const getTranslate = (config: UserConfig): Language => {
    switch (config.language.language) {
        case 'ja':
            return Ja;
        default:
            return En;
    }
};

export interface Language {
    tasks: {
        addTab: string;
        addWindow: string;
        openIncognitoWindow: string;
    };
    menus: {
        application: {
            app: {
                label: string;

                about: string;
                services: string;
                hide: string;
                hideOthers: string;
                showAll: string;
                quit: string;
            }
            file: {
                label: string;

                newTab: string;
                newWindow: string;
                openIncognitoWindow: string;
                savePage: string;
                print: string;
                settings: string;
                closeTab: string;
                closeWindow: string;
                quit: string;
            }
            edit: {
                label: string;

                undo: string;
                redo: string;
                cut: string;
                copy: string;
                paste: string;
                pastePlainText: string;
                delete: string;
                selectAll: string;
                find: string;
            }
            view: {
                label: string;

                fullScreen: string;
                sidebar: string;
                zoomIn: string;
                zoomOut: string;
                zoomReset: string;
                viewSource: string;
                devTool: string;
                appDevTool: string;
            }
            navigation: {
                label: string;

                back: string;
                forward: string;
                reload: string;
                reloadIgnoringCache: string;
                home: string;
                bookmarks: string;
                history: string;
                downloads: string;
            }
            tab: {
                label: string;

                addTab: string;
                removeTab: string;
                removeOtherTabs: string;
                removeLeftTabs: string;
                removeRightTabs: string;
                prevTab: string;
                nextTab: string;
            }
            window: {
                label: string;
            }
            help: {
                label: string;

                help: string;
                feedback: string;
                openProcessManager: string;
                about: string;
            }
        };
        view: {
            link: {
                newTab: string;
                newWindow: string;
                openIncognitoWindow: string;
                saveLink: string;
                copyLink: string;
            };
            image: {
                newTab: string;
                saveImage: string;
                copyImage: string;
                copyLink: string;
            };
            editable: {
                emojiPanel: string;
                undo: string;
                redo: string;
                cut: string;
                copy: string;
                paste: string;
                pastePlainText: string;
                selectAll: string;
            };
            selection: {
                copy: string;
                textSearch: string;
                textLoad: string;
            };
            fullScreen: {
                fullScreenExit: string;
                toolBar: string;
            };
            back: string;
            forward: string;
            reload: string;
            stop: string;
            media: {
                audioMute: string;
                audioMuteExit: string;
                pictureInPicture: string;
            };
            savePage: string;
            print: string;
            viewSource: string;
            devTool: string;
        };
        tab: {
            addTab: string;
            moveToWindow: string;
            reload: string;
            stop: string;
            duplicate: string;
            pin: string;
            unpin: string;
            mute: string;
            unmute: string;
            removeTab: string;
            removeOtherTabs: string;
            removeLeftTabs: string;
            removeRightTabs: string;
        };
    };
    windows: {
        app: {
            title: string;
        };
        processManager: {
            title: string;
        };
    };
    pages: {
        settings: {
            title: string;

            appearance: {
                title: string;

                theme: {
                    title: string;

                    system: string;
                    light: string;
                    dark: string;
                }
                tabPosition: {
                    title: string;

                    topSingle: string;
                    topDouble: string;
                    left: string;
                    right: string;
                }
            }
        };
    };
}

import { APPLICATION_NAME } from '../utils';
import { Language } from './language';

export const En: Language = {
    tasks: {
        addTab: 'New tab',
        addWindow: 'New window',
        openIncognitoWindow: 'Open Private window'
    },
    menus: {
        application: {
            newTab: 'New tab',
            newWindow: 'New window',
            openIncognitoWindow: 'Open Private window',

            bookmarks: 'Bookmarks',
            histories: 'Histories',
            downloads: 'Downloads',
            applications: 'Applications',
            extensions: 'Extensions',

            print: 'Print',
            find: 'Find',
            share: 'Share',

            settings: 'Settings',
            help: {
                label: 'Help'
            },
            close: 'Close'
        },
        window: {
            app: {
                label: APPLICATION_NAME,
                about: `About ${APPLICATION_NAME}`,
                services: 'Services',
                hide: `Hide ${APPLICATION_NAME}`,
                hideOthers: 'Hide Others',
                showAll: 'Show All',
                quit: `Quit ${APPLICATION_NAME}`
            },
            file: {
                label: 'File',

                newTab: 'New tab',
                newWindow: 'New window',
                openIncognitoWindow: 'Open Private window',
                savePage: 'Save page',
                print: 'Print',
                settings: 'Settings',
                closeTab: 'Close tab',
                closeWindow: 'Close window',
                quit: `Quit ${APPLICATION_NAME}`
            },
            edit: {
                label: 'Edit',

                undo: 'Undo',
                redo: 'Redo',
                cut: 'Cut',
                copy: 'Copy',
                paste: 'Paste',
                pastePlainText: 'Paste as plain text',
                delete: 'Delete',
                selectAll: 'Select All',
                find: 'Find on page'
            },
            view: {
                label: 'View',

                fullScreen: 'Toggle Full Screen',
                toolbar: 'Toggle Toolbar',
                sidebar: 'Toggle Sidebar',
                zoomIn: 'Zoom in',
                zoomOut: 'Zoom out',
                zoomReset: 'Zoom reset',
                viewSource: 'View source',
                devTool: 'Developer Tool',
                appDevTool: 'Developer Tool (Window)'
            },
            navigation: {
                label: 'Navigation',

                intelligentSearch: 'Intelligent Search',
                back: 'Go back',
                forward: 'Go forward',
                reload: 'Reload',
                reloadIgnoringCache: 'Reload (Clear Cache)',
                home: 'Home page',
                bookmarks: 'Bookmarks',
                histories: 'Histories',
                downloads: 'Downloads',
                applications: 'Applications',
                extensions: 'Extensions'
            },
            tab: {
                label: 'Tab',

                addTab: '新しいタブを開く',
                removeTab: 'タブを閉じる',
                removeOtherTabs: '他のタブを閉じる',
                removeLeftTabs: '左側のタブを閉じる',
                removeRightTabs: '右側のタブを閉じる',
                duplicateTab: 'タブを複製',
                pinTab: 'タブをピン留め',
                unpinTab: 'タブのピン留めを解除',
                muteTab: 'タブのミュート',
                unmuteTab: 'タブのミュートを解除',
                prevTab: '前のタブを表示',
                nextTab: '次のタブを表示'
            },
            window: {
                label: 'Window',

                addWindow: '新しいウィンドウを開く',
                openIncognitoWindow: 'プライベート ウィンドウを開く',
                removeWindow: 'ウィンドウを閉じる',
                removeOtherWindows: '他のウィンドウを閉じる',
                minimizeWindow: 'ウィンドウを最小化',
                maximizeWindow: 'ウィンドウを最大化',
                unmaximizeWindow: 'ウィンドウを元に戻す',
                toggleFullScreen: 'ウィンドウを全画面表示',
                openProcessManager: 'Open Process manager'
            },
            user: {
                label: 'User',

                addUser: 'Add user',
                removeUser: 'Remove user',
                editUser: 'Edit user'
            },
            help: {
                label: 'Help',

                help: 'Help',
                feedback: 'Send Feedback',
                openProcessManager: 'Open Process manager',
                about: `About ${APPLICATION_NAME}`
            }
        },
        view: {
            link: {
                newTab: 'Open link in new tab',
                newWindow: 'Open link in new window',
                openIncognitoWindow: 'Open link in private window',
                openAsAnotherUser: 'Open a link as another user',
                saveLink: 'Save link as',
                copyLink: 'Copy link'
            },
            image: {
                newTab: 'Open image in new tab',
                saveImage: 'Save image as',
                copyImage: 'Copy image',
                copyLink: 'Copy image link'
            },
            editable: {
                emojiPanel: 'Emote Palette',
                undo: 'Undo',
                redo: 'Redo',
                cut: 'Cut',
                copy: 'Copy',
                paste: 'Paste',
                pastePlainText: 'Paste as plain text',
                selectAll: 'Select all'
            },
            selection: {
                copy: 'Copy',
                textSearch: 'Search %n for "%t"',
                textLoad: 'Go to %u'
            },
            fullScreen: {
                fullScreenExit: 'Exit full screen',
                toolBar: 'Toggle toolbar'
            },
            back: 'Back',
            forward: 'Forward',
            reload: 'Reload',
            stop: 'Stop loading',
            media: {
                audioMute: 'Mute tab',
                audioMuteExit: 'Unmute tab',
                pictureInPicture: 'Picture in Picture'
            },
            savePage: 'Save page',
            print: 'Print',
            viewSource: 'View source',
            devTool: 'Developer Tool'
        },
        tab: {
            addTab: '新しいタブを開く',
            moveToWindow: 'このタブを新しいウィンドウに移動',
            reload: '再読み込み',
            stop: '中止',
            duplicateTab: 'タブを複製',
            pinTab: 'タブをピン留め',
            unpinTab: 'タブのピン留めを解除',
            muteTab: 'タブのミュート',
            unmuteTab: 'タブのミュートを解除',
            removeTab: 'タブを閉じる',
            removeOtherTabs: '他のタブを閉じる',
            removeLeftTabs: '左側のタブを閉じる',
            removeRightTabs: '右側のタブを閉じる'
        }
    },
    windows: {
        app: {
            title: APPLICATION_NAME,

            pageInformation: {
                label: 'Page information',

                certificate: {
                    secure: {
                        label: 'この接続は保護されています',
                        description: 'あなたがこのサイトに送信した情報（パスワード、クレジットカード情報など）が第三者に見られる事はありません。'
                    },
                    inSecure: {
                        label: 'このサイトへの接続は保護されていません',
                        description: 'このサイトでは機密情報（パスワード、クレジットカード情報など）を入力しないでください。悪意のあるユーザーに情報が盗まれる恐れがあります。'
                    },
                    file: {
                        label: 'ローカル ファイルを表示しています',
                        description: ''
                    },
                    source: {
                        label: 'ページのソースを表示しています',
                        description: ''
                    },
                    internal: {
                        label: `保護された ${APPLICATION_NAME} ページを表示しています`,
                        description: ''
                    },
                    extension: {
                        label: '拡張機能のページを表示しています',
                        description: ''
                    }
                }
            }
        },
        processManager: {
            title: 'Process Manager'
        }
    },
    pages: {
        histories: {
            title: 'Histories',

            all: 'All',
            today: 'Today',
            yesterday: 'Yesterday',
            lastWeek: 'Last week',
            before: 'Before',

            notFound: 'No pages were viewed during this period.'
        },
        settings: {
            title: 'Settings',

            appearance: {
                title: 'Appearance',

                mode: {
                    title: 'Overall Theme',

                    system: 'System',
                    light: 'Light',
                    dark: 'Dark'
                },
                theme: {
                    title: 'Theme',

                    none: 'None',
                    morningFog: 'Morning fog',
                    icyMint: 'Icy mint',
                    islandGetaway: 'Island getaway'
                },
                tabPosition: {
                    title: 'Tab Position',

                    topSingle: 'Top (1 Rows)',
                    topDouble: 'Top (2 Rows)',
                    left: 'Left',
                    right: 'Right'
                },
                button: {
                    title: 'Select buttons to display',

                    home: 'Home',
                    bookmarks: 'Bookmarks',
                    histories: 'Histories',
                    downloads: 'Downloads',
                    applications: 'Applications',
                    extensions: 'Extensions'
                }
            },
            pages: {
                title: 'Startup, Home, New Tab',

                startup: {
                    title: 'Startup',

                    newTab: 'Open new tab page',
                    prevSessions: 'Open the page that was displayed at the last startup',
                    custom: 'Open a specific page or set of pages'
                },
                home: {
                    title: 'Home',

                    button: {
                        name: 'Show Home button on Toolbar',
                        description: 'Set the page to be displayed when the Home button is pressed'
                    },
                    newTab: 'Open new tab page',
                    custom: 'Open a specific page'
                }
            }
        }
    }
};

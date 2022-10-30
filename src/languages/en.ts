import { APPLICATION_NAME } from '../constants';
import { Language } from './language';

export const En: Language = {
    common: {
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
        information: 'Information',
        yes: 'Yes',
        no: 'No',
        none: 'None',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        add: 'Add',
        remove: 'Remove',
        delete: 'Delete'
    },

    permissions: {
        geolocation: {
            title: 'Location',
            description: 'Many sites use the user\'s location to retrieve local news and information about nearby stores.',

            enable: 'Allow sites to request the use of location information',
            disable: 'Do not allow the site to use your location'
        },
        camera: {
            title: 'Camera',
            description: 'Many sites use webcams for video chat and other communication functions.',

            enable: 'Allow sites to request the use of cameras',
            disable: 'Do not allow the use of cameras on the site'
        },
        microphone: {
            title: 'Microphone',
            description: 'Many sites use microphones for video chat and other communication functions.',

            enable: 'Allow sites to request the use of microphones',
            disable: 'Do not allow the use of microphones on the site'
        },
        notifications: {
            title: 'Notifications',
            description: 'The site sends notifications to keep you informed of updates, chat messages, etc.',

            enable: 'Allow sites to request that notifications be sent',
            disable: 'Do not allow the site to send notifications'
        },
        sensors: {
            title: 'Motion Sensor',
            description: 'Use the device\'s motion sensors for features such as virtual reality and fitness tracking.',

            enable: 'Allow sites to request the use of motion sensors',
            disable: 'Do not allow sites to use motion sensors'
        },
        midi: {
            title: 'MIDI Device',
            description: 'Connects to a MIDI device for music production or editing.',

            enable: 'Allow sites to request a connection to a MIDI device',
            disable: 'Do not allow sites to connect to MIDI devices'
        },
        hid: {
            title: 'HID Device',
            description: 'Connect to HID devices to accommodate functions that use less common keyboards or devices such as game controllers.',

            enable: 'Allow sites to request a connection to HID devices',
            disable: 'Do not allow sites to connect to HID devices'
        },
        serial: {
            title: 'Serial Port',
            description: 'Connect to the serial port to use data transfer functions, such as setting up a network.',

            enable: 'Allow sites to request a connection to the serial port',
            disable: 'Do not allow site to connect to serial port'
        },
        idle_detection: {
            title: 'Device active status',
            description: 'Detects the active status of the device and sets the status of the chat application.',

            enable: 'Allow sites to request detection of device active status',
            disable: 'Do not allow detection of the active state of the device by the site'
        },
        clipboard: {
            title: 'Clipboard read/write',
            description: 'Many sites read the clipboard to retain the formatting of copied text, for example.',

            enable: 'Allow sites to request access to text and images in the clipboard',
            disable: 'Do not allow sites to access text or images in the clipboard'
        },
        pointer_lock: {
            title: 'Pointer Lock',
            description: 'The site occupies the mouse cursor to be able to control FPS games, etc.',

            enable: 'Allow sites to request mouse cursor lock',
            disable: 'Do not allow the site to lock the mouse cursor'
        },
        open_external: {
            title: 'Open an external application',
            description: 'Many sites open external apps for seamless transitions to desktop apps.',

            enable: 'Allow sites to require external apps to open',
            disable: 'Do not allow external apps to open on the site'
        }
    },
    contents: {
        cookies: 'Cookie & Site Data',
        javascript: 'JavaScript',
        images: 'Images',
        sounds: 'Sounds',
        ads: 'Ads',
        protected_content: 'Protected Content',
        zoom_level: 'Zoom Level'
    },

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

            zoom: {
                label: 'Zoom',

                zoomIn: 'Zoom in',
                zoomOut: 'Zoom out',
                zoomReset: 'Zoom reset',
                fullScreen: 'Toggle Full Screen'
            },
            edit: {
                label: 'Edit',

                cut: 'Cut',
                copy: 'Copy',
                paste: 'Paste'
            },

            bookmarks: 'Bookmarks',
            history: 'History',
            downloads: 'Downloads',
            applications: 'Applications',
            extensions: 'Extensions',

            print: 'Print',
            find: 'Find',
            share: {
                label: 'Share',

                twitter: 'Twitter',
                facebook: 'Facebook',
                copyLink: 'Copy link',
                qrCode: 'Show QR Code'
            },

            settings: 'Settings',
            helpAndFeedback: {
                label: 'Help & Feedback',

                help: 'Help',
                feedback: 'Send Feedback',
                whatsNewAndHint: 'What\'s New & Tips',
                about: `About ${APPLICATION_NAME}`
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
                history: 'History',
                downloads: 'Downloads',
                applications: 'Applications',
                extensions: 'Extensions'
            },
            tab: {
                label: 'Tab',

                addTab: 'New tab',
                removeTab: 'Close tab',
                removeOtherTabs: 'Close other tabs',
                removeLeftTabs: 'Close tabs on the left',
                removeRightTabs: 'Close tabs on the right',
                duplicateTab: 'Duplicate tab',
                pinTab: 'Pin tab',
                unpinTab: 'Unpin tab',
                muteTab: 'Mute tab',
                unmuteTab: 'Unmute tab',
                prevTab: 'Select previous tab',
                nextTab: 'Select next tab'
            },
            window: {
                label: 'Window',

                addWindow: 'New window',
                openIncognitoWindow: 'Open Private window',
                removeWindow: 'Close window',
                removeOtherWindows: 'Close other windows',
                minimizeWindow: 'Minimize window',
                maximizeWindow: 'Maximize window',
                unmaximizeWindow: 'Restore window',
                toggleFullScreen: 'Toggle Full Screen',
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
            stop: 'Stop',
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
            addTab: 'New tab',
            moveToWindow: 'Move this tab to a new window',
            reload: 'Reload',
            stop: 'Stop',
            duplicateTab: 'Duplicate tab',
            pinTab: 'Pin tab',
            unpinTab: 'Unpin tab',
            muteTab: 'Mute tab',
            unmuteTab: 'Unmute tab',
            removeTab: 'Close tab',
            removeOtherTabs: 'Close other tabs',
            removeLeftTabs: 'Close tabs on the left',
            removeRightTabs: 'Close tabs on the right'
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
            },

            addressBar: {
                placeholder: 'Search by %n or Enter URL',
                searchEngine: {
                    suggested: 'Press %k to search by %n',
                    selected: 'Search by %n'
                }
            }
        },
        processManager: {
            title: 'Process Manager'
        }
    },
    pages: {
        bookmarks: {
            title: 'Bookmarks',

            all: 'All bookmarks',

            addBookmark: 'Add bookmark',
            addFolder: 'Add folder',
            delete: 'Remove',
            edit: 'Edit',
            rename: 'Rename',
            move: 'Move',

            notFound: 'There are no bookmarks registered for this location.'
        },
        history: {
            title: 'History',

            all: 'All history',
            today: 'Today',
            yesterday: 'Yesterday',
            lastWeek: 'Last week',
            before: 'Before',

            search: {
                title: 'Search Results',
                placeholder: 'Search History'
            },

            notFound: 'No pages were viewed during this period.'
        },
        downloads: {
            title: 'Downloads',

            all: 'All files',
            images: 'Images',
            videos: 'Videos',
            audios: 'Audios',

            search: {
                title: 'Search Results',
                placeholder: 'Search Files'
            },

            openFile: 'Open',
            openFolder: 'Open folder',
            save: 'Save',
            saveAs: 'Save as',
            pause: 'Pause',
            resume: 'Resume',
            retry: 'Retry',

            notFound: 'There are no downloaded items.'
        },
        applications: {
            title: 'Applications',

            notFound: 'There is no application installed.'
        },
        extensions: {
            title: 'Extensions',

            notFound: 'There are no extensions added.'
        },
        settings: {
            title: 'Settings',

            profileAndUsers: {
                title: 'Profile & Users',

                accountAndSync: {
                    title: 'Account & Sync',

                    login: 'Log in',
                    logout: 'Log out'
                }
            },
            privacyAndSecurity: {
                title: 'Privacy & Security',

                privacy: {
                    title: 'Privacy',

                    sendDNTRequest: 'Send a "Do Not Track" request to the site'
                },
                history: {
                    title: 'History',

                    save: 'Save history',
                    delete: 'Delete browsing history'
                },
                suggests: {
                    title: 'Suggests',

                    search: 'Suggest from Google Search',
                    bookmarks: 'Suggest from bookmarks',
                    history: 'Suggest from history'
                }
            },
            adBlocker: {
                title: 'Ad Blocker',

                enabled: 'Enable Ad Blocker',
                filters: 'Filters'
            },
            appearance: {
                title: 'Appearance',

                colorScheme: {
                    title: 'Color Scheme',

                    system: 'System',
                    light: 'Light',
                    dark: 'Dark',

                    tabColored: 'Set the tabs to the theme colors set for the site'
                },
                theme: {
                    title: 'Theme'
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
                    history: 'History',
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
                        primary: 'Show Home button on Toolbar',
                        secondary: 'Set the page to be displayed when the Home button is pressed'
                    },
                    newTab: 'Open new tab page',
                    custom: 'Open a specific page'
                },
                newTab: {
                    title: 'New Tab',

                    default: 'Open default page',
                    custom: 'Open a specific page'
                }
            },
            searchAndAddressBar: {
                title: 'Search & Address bar',

                suggests: {
                    title: 'Suggests',

                    search: 'Suggest from Google Search',
                    bookmarks: 'Suggest from bookmarks',
                    history: 'Suggest from history'
                },
                addressBar: {
                    title: 'Address bar',

                    defaultEngine: 'Search engines used in the address bar and right-click menu',
                    suggestEngine: {
                        primary: 'Suggest search engines registered with @mentions and URL',
                        secondary: 'Press %k during suggestions to search with the selected search engine'
                    }
                }
            },
            sites: {
                title: 'Cookie & Site Settings',

                permissions: 'Permissions',
                contents: 'Contents',

                default: 'デフォルトの動作'
            },
            download: {
                title: 'Download',

                path: 'デフォルトの保存先',
                checkPathEvery: 'ファイルの保存先を毎回確認する',
                checkOperationEvery: 'ダウンロード時の動作を毎回確認する'
            },
            systemAndPerformance: {
                title: 'System & Performance',

                smoothTabSwitching: {
                    primary: 'Smooth tab switching',
                    secondary: 'Disable this option if performance is affected.'
                }
            }
        }
    }
};

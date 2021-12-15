import { APPLICATION_NAME } from '../utils';
import { Language } from './language';

export const Ja: Language = {
    tasks: {
        addTab: '新しいタブ',
        addWindow: '新しいウィンドウ',
        openIncognitoWindow: 'プライベート ウィンドウを開く'
    },
    menus: {
        application: {
            app: {
                label: APPLICATION_NAME,

                about: `${APPLICATION_NAME} について`,
                services: 'サービス',
                hide: `${APPLICATION_NAME} を非表示にする`,
                hideOthers: 'その他を非表示にする',
                showAll: 'すべて表示',
                quit: `${APPLICATION_NAME} を終了`
            },
            file: {
                label: 'ファイル',

                newTab: '新しいタブ',
                newWindow: '新しいウィンドウ',
                openIncognitoWindow: 'プライベート ウィンドウを開く',
                savePage: 'ページの保存',
                print: '印刷',
                settings: '設定',
                closeTab: 'タブを閉じる',
                closeWindow: 'ウィンドウを閉じる',
                quit: `${APPLICATION_NAME} を終了`
            },
            edit: {
                label: '編集',

                undo: '元に戻す',
                redo: 'やり直す',
                cut: '切り取り',
                copy: 'コピー',
                paste: '貼り付け',
                pastePlainText: 'プレーン テキストとして貼り付け',
                delete: '削除',
                selectAll: 'すべて選択',
                find: '検索'
            },
            view: {
                label: '表示',

                fullScreen: '全画面表示の切り替え',
                sidebar: 'サイドバーの切り替え',
                zoomIn: 'ページを拡大',
                zoomOut: 'ページを縮小',
                zoomReset: 'ページのズームをリセット',
                viewSource: 'ページのソースを表示',
                devTool: 'デベロッパー ツール',
                appDevTool: 'デベロッパー ツール (ウィンドウ)'
            },
            navigation: {
                label: 'ナビゲーション',

                back: '前のページに戻る',
                forward: '次のページに進む',
                reload: '再読み込み',
                reloadIgnoringCache: '再読み込み (キャッシュの削除)',
                home: 'ホームページに移動',
                history: '履歴',
                downloads: 'ダウンロード',
                bookmarks: 'ブックマーク'
            },
            tab: {
                label: 'タブ',

                addTab: '新しいタブを開く',
                prevTab: '前のタブを表示',
                nextTab: '次のタブを表示',
                removeTab: 'タブを閉じる',
                removeOtherTabs: '他のタブを閉じる',
                removeLeftTabs: '左側のタブを閉じる',
                removeRightTabs: '右側のタブを閉じる'
            },
            window: {
                label: 'ウィンドウ'
            },
            help: {
                label: 'ヘルプ',

                help: 'ヘルプ',
                feedback: 'フィードバックの送信',
                openProcessManager: 'プロセス マネージャーを開く',
                about: `${APPLICATION_NAME} について`
            }
        },
        view: {
            link: {
                newTab: '新しいタブで開く',
                newWindow: '新しいウィンドウで開く',
                openIncognitoWindow: 'プライベート ウィンドウで開く',
                saveLink: '名前を付けてリンク先を保存',
                copyLink: 'リンクのアドレスをコピー'
            },
            image: {
                newTab: '新しいタブで画像を開く',
                saveImage: '名前を付けて画像を保存',
                copyImage: '画像をコピー',
                copyLink: '画像のアドレスをコピー'
            },
            editable: {
                emojiPanel: '絵文字パレット',
                undo: '元に戻す',
                redo: 'やり直す',
                cut: '切り取り',
                copy: 'コピー',
                paste: '貼り付け',
                pastePlainText: 'プレーン テキストとして貼り付け',
                selectAll: 'すべて選択'
            },
            selection: {
                copy: 'コピー',
                textSearch: '%n で「%t」を検索',
                textLoad: '%u に移動'
            },
            fullScreen: {
                fullScreenExit: '全画面表示を終了',
                toolBar: 'ツールバー表示の切り替え'
            },
            back: '戻る',
            forward: '進む',
            reload: '再読み込み',
            stop: '中止',
            media: {
                audioMute: 'タブをミュート',
                audioMuteExit: 'タブのミュートを解除',
                pictureInPicture: 'ピクチャー イン ピクチャー'
            },
            savePage: '名前を付けて保存',
            print: '印刷',
            viewSource: 'ページのソースを表示',
            devTool: 'デベロッパー ツール'
        },
        tab: {
            addTab: '新しいタブを開く',
            moveToWindow: 'このタブを新しいウィンドウに移動',
            reload: '再読み込み',
            stop: '中止',
            duplicate: 'タブを複製',
            pin: 'タブをピン留め',
            unpin: 'タブのピン留めを解除',
            mute: 'タブのミュート',
            unmute: 'タブのミュートを解除',
            removeTab: 'タブを閉じる',
            removeOtherTabs: '他のタブを閉じる',
            removeLeftTabs: '左側のタブを閉じる',
            removeRightTabs: '右側のタブを閉じる'
        }
    },
    windows: {
        app: {
            title: APPLICATION_NAME
        },
        processManager: {
            title: 'プロセス マネージャー'
        }
    },
    pages: {
        settings: {
            title: '設定',

            appearance: {
                title: 'デザインと外観',

                theme: {
                    title: '配色テーマ',

                    system: 'システムに合わせる',
                    light: 'ライト',
                    dark: 'ダーク'
                },
                tabPosition: {
                    title: 'タブとアドレスバーの配置',

                    topSingle: '上 (1行)',
                    topDouble: '上 (2行)',
                    left: '左',
                    right: '右'
                }
            }
        }
    }
};

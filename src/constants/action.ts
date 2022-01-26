export type ActionId = 'BACK' | 'FORWARD';
export type ActionType = 'action' | 'bookmark' | 'history' | 'download';

export interface Action {
    id: ActionId | string;
    type: ActionType;
    label: string;
    description?: string;
    keywords: string[];
}

export const ActionMap: { [key in ActionId]: Action } = {
    BACK: {
        id: 'BACK',
        type: 'action',
        label: '戻る',
        description: '前のページに戻ります。',
        keywords: ['back', 'previous', 'prev', 'もどる', '戻る']
    },
    FORWARD: {
        id: 'FORWARD',
        type: 'action',
        label: '進む',
        description: '次のページに進みます。',
        keywords: ['forward', 'next', 'すすむ', '進む']
    }
};

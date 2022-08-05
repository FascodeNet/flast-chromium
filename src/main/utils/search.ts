import fetch from 'node-fetch';
import { BookmarkData, DefaultUserConfig, HistoryData } from '../../interfaces/user';
import { SuggestData } from '../../renderer/views/browser/search/interface';
import { isURL } from '../../utils/url';
import { IUser } from '../interfaces/user';
import { IncognitoUser } from '../user/incognito';

export interface SearchResult {
    suggests: ResultData[];
    bookmarks: ResultData[];
    history: ResultData[];
}

export const DefaultSearchResult: SearchResult = {
    suggests: [],
    bookmarks: [],
    history: []
};

export type ResultType = 'search' | 'address' | 'bookmark' | 'history';

export interface ResultData {
    resultType: ResultType;
    title: string;
    url: string;
    favicon?: string;
}

export const search = async (value: string, user: IUser): Promise<SearchResult> => {
    const { suggests: suggest, default_engine: defaultEngine, engines } = user.settings.config.search;

    const bookmarks = user.type !== 'guest' && suggest.bookmarks ? map(
        filter(
            user.bookmarks.bookmarks.filter(({ title, url }) => {
                return title && url && (contains(title, value) || contains(url, value));
            })
        ),
        'bookmark'
    ) : [];
    const history = user.type !== 'guest' && suggest.history ? map(
        filter(
            (user instanceof IncognitoUser ? user.fromUser : user).history.history.filter(({ title, url }) => {
                return title && url && (contains(title, value) || contains(url, value));
            })
        ),
        'history'
    ) : [];

    if (user.type === 'incognito') {
        return {
            suggests: [],
            bookmarks,
            history
        };
    }

    try {
        const result = await fetch(`https://google.com/complete/search?client=chrome&hl=ja&ie=utf_8&oe=utf_8&q=${encodeURIComponent(value)}`);
        const buffer = await result.arrayBuffer();
        const decoder = new TextDecoder('Shift_JIS');
        const data = JSON.parse(decoder.decode(buffer));

        const values = data[1] as string[];
        const types = (data[4]['google:suggesttype'] as string[]).map((type) => type.toLowerCase());
        const suggestDataList: SuggestData[] = [];
        for (let i = 0; i < values.length; i++)
            suggestDataList.push({ value: values[i], type: types[i] });

        const defaultSearchEngine = engines[defaultEngine] ?? DefaultUserConfig.search.engines[0];
        const suggests = suggest.search ? suggestDataList.map(({ value }): ResultData => {
            const isValueUrl = isUrl(value);
            return ({
                resultType: isValueUrl ? 'address' : 'search',
                title: value,
                url: isValueUrl ? value : defaultSearchEngine.url.replace('%s', encodeURIComponent(value))
            });
        }) : [];

        return {
            suggests,
            bookmarks,
            history
        };
    } catch (e) {
        return {
            suggests: [],
            bookmarks,
            history
        };
    }
};

const isUrl = (value: string) => isURL(value) || value.includes('://') || value.toLowerCase().startsWith('about:');

const contains = (value: string | undefined, keyword: string) => {
    const encodedValue = encodeURIComponent(value ?? '');
    const encodedKeyword = encodeURIComponent(keyword);
    return (value ?? '').toLowerCase().includes(keyword.toLowerCase()) || encodedValue.toLowerCase().includes(encodedKeyword.toLowerCase());
};

const filter = (array: (BookmarkData | HistoryData)[]) => array.filter((data, i) => array.findIndex(
    ({ title, url }) => title === data.title || url === data.url
) === i);

const map = (array: (BookmarkData | HistoryData)[], type: ResultType): ResultData[] => array.map((
    {
        title,
        url,
        favicon
    }
): ResultData => ({
    resultType: type,
    title: title!!,
    url: url!!,
    favicon
}));

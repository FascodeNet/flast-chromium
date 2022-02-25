import fetch from 'node-fetch';
import { IBookmark, IHistory } from '../../interfaces/user';
import { SuggestData } from '../../renderer/views/browser/search/interface';
import { isURL } from '../../utils/url';
import { IUser } from '../interfaces/user';

export interface SearchResult {
    suggests: ResultData[];
    bookmarks: ResultData[];
    histories: ResultData[];
}

export const DefaultSearchResult: SearchResult = {
    suggests: [],
    bookmarks: [],
    histories: []
};

export type ResultType = 'search' | 'address' | 'bookmark' | 'history';

export interface ResultData {
    type: ResultType;
    title: string;
    url: string;
    favicon?: string;
}

export const search = async (value: string, user: IUser): Promise<SearchResult> => {
    const bookmarks = user.type !== 'guest' ? map(filter(user.bookmarks.bookmarks.filter(({ title, url }) => {
        return title && url && (contains(title, value) || contains(url, value));
    })), 'bookmark') : [];
    const histories = user.type !== 'guest' ? map(filter(user.histories.histories.filter(({ title, url }) => {
        return title && url && (contains(title, value) || contains(url, value));
    })), 'history') : [];

    try {
        const result = await fetch(`https://google.com/complete/search?client=chrome&hl=ja&ie=utf_8&oe=utf_8&q=${encodeURIComponent(value)}`);
        const buffer = await result.arrayBuffer();
        const decoder = new TextDecoder('Shift_JIS');
        const data = JSON.parse(decoder.decode(buffer));

        const values = data[1] as string[];
        const types = (data[4]['google:suggesttype'] as string[]).map((type) => type.toLowerCase());
        let suggestDatas: SuggestData[] = [];
        for (let i = 0; i < values.length; i++)
            suggestDatas.push({ value: values[i], type: types[i] });

        const suggests = user.type !== 'incognito' ? suggestDatas.map(({ value }): ResultData => {
            const isValueUrl = isUrl(value);
            return ({
                type: isValueUrl ? 'address' : 'search',
                title: value,
                url: isValueUrl ? value : 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(value))
            });
        }) : [];

        return {
            suggests,
            bookmarks,
            histories
        };
    } catch (e) {
        return {
            suggests: [],
            bookmarks,
            histories
        };
    }
};

const isUrl = (value: string) => isURL(value) || value.includes('://') || value.toLowerCase().startsWith('about:');

const contains = (value: string | undefined, keyword: string) => {
    const encodedValue = encodeURIComponent(value ?? '');
    const encodedKeyword = encodeURIComponent(keyword);
    return (value ?? '').includes(keyword) || encodedValue.includes(encodedKeyword);
};

const filter = (array: (IBookmark | IHistory)[]) => array.filter((data, i) => array.findIndex(
    ({ title, url }) => title === data.title || url === data.url
) === i);

const map = (array: (IBookmark | IHistory)[], type: ResultType): ResultData[] => array.map((
    {
        title,
        url,
        favicon
    }
): ResultData => ({
    type,
    title: title!!,
    url: url!!,
    favicon: favicon
}));

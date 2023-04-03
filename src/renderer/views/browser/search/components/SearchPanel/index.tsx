import { PublicOutlined } from '@mui/icons-material';
import { Avatar, Divider, styled } from '@mui/material';
import React, {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    MouseEvent,
    SetStateAction,
    useCallback,
    useEffect,
    useState
} from 'react';
import reactStringReplace from 'react-string-replace';
import { APPLICATION_PROTOCOL } from '../../../../../../constants';
import { BookmarkData, DefaultUserConfig, SearchEngine } from '../../../../../../interfaces/user';
import { ViewState } from '../../../../../../interfaces/view';
import { getTranslate } from '../../../../../../languages/language';
import { ResultData } from '../../../../../../main/utils/search';
import { equals, includes } from '../../../../../../utils';
import { split } from '../../../../../../utils/array';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { IconButton } from '../../../../../components/Button';
import { Code } from '../../../../../components/Code';
import { Search, Share, Star, StarFilled } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { ResultType } from '../../interface';
import { StyledButtonContainer, StyledIcon, StyledInput, StyledLabel, StyledPanel } from './styles';

const Button = styled(IconButton)({
    minWidth: 30,
    height: 30,
    padding: 5,
    'svg, img': {
        width: 20,
        height: 20
    }
});

const filter = (array: ResultData[]) => array.filter((data, i) => array.findIndex(
    ({ title, url }) => title === data.title || url === data.url
) === i);

interface Props {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;

    selectedIndex: number;
    setSelectedIndex: Dispatch<SetStateAction<number>>;
    data: ResultData[];
    setData: Dispatch<SetStateAction<ResultData[]>>;

    type: ResultType;
    setType: Dispatch<SetStateAction<ResultType>>;
    engine: SearchEngine | undefined;
    setEngine: Dispatch<SetStateAction<SearchEngine | undefined>>;

    addOrLoadView: (e: KeyboardEvent<HTMLInputElement>, url: string) => void;
}

export const SearchPanel = (
    {
        value,
        setValue,

        selectedIndex,
        setSelectedIndex,
        data,
        setData,

        type,
        setType,
        engine,
        setEngine,

        addOrLoadView
    }: Props
) => {
    const {
        viewsApi,
        dialogApi,
        bookmarksApi,
        search,
        getCurrentUserId
    } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { config } = useUserConfigContext();

    const translate = getTranslate(config);
    const translateSection = translate.windows.app.addressBar;

    const ref = useCallback((element: HTMLInputElement | null) => {
        if (element) {
            element.focus();
            setTimeout(() => element.select());
        }
    }, []);

    const [defaultEngine, setDefaultEngine] = useState<SearchEngine>(DefaultUserConfig.search.engines[0]);
    const [suggestedEngine, setSuggestedEngine] = useState<SearchEngine | undefined>(undefined);

    const [userId, setUserId] = useState('');
    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [bookmark, setBookmark] = useState<BookmarkData | undefined>(undefined);

    const currentView = viewsApi.getCurrentView();
    useEffect(() => {
        (async () => setState(await currentView))();

        getCurrentUserId().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const viewState = await currentView;

            const bookmarkDataList = await bookmarksApi.list(id);
            setBookmark(bookmarkDataList.find((bookmarkData) => bookmarkData.url === viewState.url));
        });
    }, [selectedId]);

    useEffect(() => {
        setDefaultEngine(config.search.engines[config.search.default_engine] ?? DefaultUserConfig.search.engines[0]);
    }, [config]);


    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        const resultType = isURL(inputValue) || inputValue.includes('://') || inputValue.toLowerCase().startsWith('about:') ? 'address' : 'suggest';

        setValue(inputValue);

        setSelectedIndex(-1);
        if (inputValue.length > 0) {
            const searchResult = await search(inputValue);
            const bookmarks = split(searchResult.bookmarks, 3);
            const history = split(searchResult.history, 3);
            const userData = filter([...bookmarks, ...history]);
            const suggests = split(searchResult.suggests, 10 - userData.length);
            setData([...suggests, ...userData]);
        } else {
            setData([]);
        }

        setType(resultType);
        if (inputValue.length > 1) {
            if (config.search.suggest_engine) {
                if (inputValue.startsWith('@')) {
                    setSuggestedEngine(
                        config.search.engines.find((searchEngine) => {
                            return searchEngine.mentions.some((mention) => equals(mention, inputValue.substring(1).trim(), true));
                        })
                    );
                } else {
                    setSuggestedEngine(
                        config.search.engines.find((searchEngine) => {
                            return includes(searchEngine.name, inputValue.trim(), true) || includes(new URL(searchEngine.url).host, inputValue.trim(), true);
                        })
                    );
                }
            }
        } else {
            setSuggestedEngine(undefined);
        }

        if (resultType === 'address') {
            try {
                const url = new URL(prefixHttp(value));

                const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}`;
                const faviconRes = await fetch(faviconUrl);

                setIcon(faviconRes.ok ? faviconUrl : undefined);
            } catch (e) {
                setIcon(undefined);
            }
        } else {
            setIcon(undefined);
        }
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Escape':
                await handleEscapeKeyDown(e);
                return;
            case 'ArrowUp':
                await handleArrowUpKeyDown(e);
                return;
            case 'ArrowDown':
                await handleArrowDownKeyDown(e);
                return;
            case 'Tab':
                await handleTabKeyDown(e);
                return;
            case 'Backspace':
                await handleBackspaceKeyDown(e);
                return;
            case 'Enter':
                await handleEnterKeyDown(e);
                return;
        }
    };

    const handleEscapeKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return;

        setEngine(undefined);
        setSuggestedEngine(undefined);
        await dialogApi.hide();
    };

    const handleArrowUpKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (e.nativeEvent.isComposing || value.length < 1 || data.length < 1) return;

        setSelectedIndex((index) => {
            const i = index > 0 ? index - 1 : data.length - 1;
            const result = data[i];
            setValue(result.resultType === 'search' ? result.title : result.url);
            setType(result.resultType !== 'search' ? 'address' : 'suggest');
            setSuggestedEngine(undefined);
            return i;
        });
    };

    const handleArrowDownKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (e.nativeEvent.isComposing || value.length < 1 || data.length < 1) return;

        setSelectedIndex((index) => {
            const i = index < data.length - 1 ? index + 1 : 0;
            const result = data[i];
            setValue(result.resultType === 'search' ? result.title : result.url);
            setType(result.resultType !== 'search' ? 'address' : 'suggest');
            setSuggestedEngine(undefined);
            return i;
        });
    };

    const handleTabKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (e.nativeEvent.isComposing || !config.search.suggest_engine || value.length < 1 || !suggestedEngine) return;

        setValue('');
        setData([]);

        setType('suggest');
        setEngine(suggestedEngine);
        setSuggestedEngine(undefined);
    };

    const handleBackspaceKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || value.length > 0 || !engine) return;

        e.preventDefault();

        setEngine(undefined);
    };

    const handleEnterKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing || value.length < 1) return;

        if (isURL(value) && !value.includes('://')) {
            const url = prefixHttp(value);
            await addOrLoadView(e, url);
        } else if (value.toLowerCase().startsWith('about:')) {
            const url = value.toLowerCase().includes('blank') ? value : value.replace('about:', `${APPLICATION_PROTOCOL}:`);
            await addOrLoadView(e, url);
        } else if (!value.includes('://')) {
            const url = (engine ?? defaultEngine).url.replace('%s', encodeURIComponent(value));
            await addOrLoadView(e, url);
        } else {
            await addOrLoadView(e, value);
        }

        await dialogApi.hide();
    };


    const handleBookmarkButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (bookmark) {
            await bookmarksApi.remove(userId, bookmark._id!!);
        } else {
            await bookmarksApi.add(
                userId,
                {
                    title: state.title,
                    url: state.url,
                    favicon: state.favicon,
                    isFolder: false
                }
            );
        }

        const bookmarks = await bookmarksApi.list(userId);
        setBookmark(bookmarks.find((bookmarkData) => bookmarkData.url === state.url));
    };

    return (
        <StyledPanel className="panel search-bar">
            <StyledIcon>
                {icon ? (
                    <Avatar
                        src={icon}
                        variant="square"
                        sx={{
                            width: 'inherit',
                            height: 'inherit',
                            userSelect: 'none'
                        }}
                    />
                ) : (type === 'suggest' ?
                        <Search sx={{ width: 'inherit', height: 'inherit' }} />
                        :
                        <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />
                )}
            </StyledIcon>
            {type === 'suggest' && engine && <StyledLabel>
                <div
                    style={{ whiteSpace: 'nowrap' }}>{translateSection.searchEngine.selected.replace('%n', engine.name)}</div>
                <Divider flexItem orientation="vertical" />
            </StyledLabel>}
            <StyledInput
                ref={ref}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder={translateSection.placeholder.replace('%n', (engine ?? defaultEngine).name)}
            />
            {suggestedEngine && <StyledLabel>
                <Divider flexItem orientation="vertical" />
                <div style={{ whiteSpace: 'nowrap' }}>
                    {reactStringReplace(
                        reactStringReplace(translateSection.searchEngine.suggested, '%k', () => (<Code>Tab</Code>)),
                        '%n',
                        () => (<b>{suggestedEngine!!.name}</b>)
                    )}
                </div>
            </StyledLabel>}
            <StyledButtonContainer>
                <Button>
                    <Share />
                </Button>
                <Button onClick={handleBookmarkButtonClick}>
                    {bookmark ? <StarFilled /> : <Star />}
                </Button>
            </StyledButtonContainer>
        </StyledPanel>
    );
};

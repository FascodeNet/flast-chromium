import { PublicOutlined } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import React, { ChangeEvent, Fragment, KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { ResultData } from '../../../../../../main/utils/search';
import { APPLICATION_PROTOCOL } from '../../../../../../utils';
import { split } from '../../../../../../utils/array';
import { isURL } from '../../../../../../utils/url';
import { Search } from '../../../../../components/Icons';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { ResultType } from '../../interface';
import { ResultItem, ResultPanel } from '../ResultPanel';
import { SearchPanel } from '../SearchPanel';
import { StyledContainer } from './styles';

export const Popup = () => {

    const { hideDialog, addView, loadView, getCurrentView, search } = useElectronAPI();
    const { selectedId } = useViewManagerContext();

    const [value, setValue] = useState('');
    const [type, setType] = useState<ResultType>('suggest');
    const [results, setResults] = useState<ResultData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const viewState = getCurrentView();
    useEffect(() => {
        (async () => {
            setValue(decodeURIComponent((await viewState)?.url ?? ''));
        })();
    }, []);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const type = isURL(value) || value.includes('://') || value.toLowerCase().startsWith('about:') ? 'address' : 'suggest';

        setValue(value);
        setType(type);
        setSelectedIndex(-1);

        if (value.length > 0) {
            const searchResult = await search(value);
            console.log(searchResult);
            const bookmarks = split(searchResult.bookmarks, 3);
            const histories = split(searchResult.histories, 3);
            const userData = [...bookmarks, ...histories];
            const suggests = split(searchResult.suggests, 10 - userData.length);
            setResults([...suggests, ...userData]);
        } else {
            setResults([]);
        }
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        // console.log(e.key);
        switch (e.key) {
            case 'Escape':
                await hideDialog();
                return;
            case 'ArrowUp':
                e.preventDefault();
                if (value.length < 1 || results.length < 1) return;
                setSelectedIndex((index) => {
                    const i = index > 0 ? index - 1 : results.length - 1;
                    const result = results[i];
                    setValue(result.type === 'search' ? result.title : result.url);
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                if (value.length < 1 || results.length < 1) return;
                setSelectedIndex((index) => {
                    const i = index < results.length - 1 ? index + 1 : 0;
                    const result = results[i];
                    setValue(result.type === 'search' ? result.title : result.url);
                    return i;
                });
                return;
            case 'Enter':
                if (e.keyCode !== 13 || value.length < 1) return;
                if (isURL(value) && !value.includes('://')) {
                    const url = `http://${value}`;
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await hideDialog();
                } else if (value.toLowerCase().startsWith('about:')) {
                    const url = value.toLowerCase().includes('blank') ? value : value.replace('about:', `${APPLICATION_PROTOCOL}:`);
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await hideDialog();
                } else if (!value.includes('://')) {
                    const url = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(value));
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await hideDialog();
                } else {
                    if (e.shiftKey) {
                        await addView(value, true);
                    } else {
                        await loadView(selectedId, value);
                    }
                    await hideDialog();
                }
                return;
        }
    };

    const handleClick = async (e: MouseEvent<HTMLDivElement>, i: number) => {
        const value = results[i].url;
        if (isURL(value) && !value.includes('://')) {
            const url = `http://${value}`;
            if (e.shiftKey) {
                await addView(url, true);
            } else {
                await loadView(selectedId, url);
            }
            await hideDialog();
        } else if (value.toLowerCase().startsWith('about:')) {
            const url = value.toLowerCase().includes('blank') ? value : value.replace('about:', `${APPLICATION_PROTOCOL}:`);
            if (e.shiftKey) {
                await addView(url, true);
            } else {
                await loadView(selectedId, url);
            }
            await hideDialog();
        } else if (!value.includes('://')) {
            const url = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(value));
            if (e.shiftKey) {
                await addView(url, true);
            } else {
                await loadView(selectedId, url);
            }
            await hideDialog();
        } else {
            if (e.shiftKey) {
                await addView(value, true);
            } else {
                await loadView(selectedId, value);
            }
            await hideDialog();
        }
    };

    return (
        <StyledContainer>
            <SearchPanel type={type} value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
            {results.length > 0 && <ResultPanel>
                {results.map(({ type, title, url, favicon }, i) => {
                    const text = title.toLowerCase();
                    const inputtedText = value.toLowerCase();
                    const suggestedText = text.replace(inputtedText, '');

                    switch (type) {
                        case 'search':
                            return (
                                <ResultItem
                                    key={i}
                                    selected={selectedIndex === i}
                                    onClick={(e) => handleClick(e, i)}
                                    icon={<Search sx={{ width: 'inherit', height: 'inherit' }} />}
                                    label={
                                        text.startsWith(inputtedText) ? <Fragment>
                                            <b>{inputtedText}</b>{suggestedText}
                                        </Fragment> : text
                                    }
                                />
                            );
                        default:
                            return (
                                <ResultItem
                                    key={i}
                                    selected={selectedIndex === i}
                                    onClick={(e) => handleClick(e, i)}
                                    icon={favicon ?
                                        <Avatar src={favicon} sx={{ width: 'inherit', height: 'inherit' }} /> :
                                        <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />}
                                    label={title}
                                    subLabel={type !== 'address' ? decodeURIComponent(url) : undefined}
                                />
                            );
                    }
                })}
            </ResultPanel>}
        </StyledContainer>
    );
};

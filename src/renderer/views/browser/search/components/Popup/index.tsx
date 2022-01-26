import { PublicOutlined, SearchOutlined } from '@mui/icons-material';
import React, { ChangeEvent, Fragment, KeyboardEvent, useState } from 'react';
import { APPLICATION_PROTOCOL } from '../../../../../../utils';
import { isURL } from '../../../../../../utils/url';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { ResultItem, ResultPanel } from '../ResultPanel';
import { SearchPanel } from '../SearchPanel';
import { StyledContainer } from './styles';

const suggest = require('node-suggest');

export const Popup = () => {

    const { destroyDialog, addView, loadView } = useElectronAPI();
    const { selectedId } = useViewManagerContext();

    const [value, setValue] = useState('');
    const [type, setType] = useState<'search' | 'address'>('search');
    const [suggestResults, setSuggestResults] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setValue(value);
        setType(isURL(value) || value.includes('://') || value.toLowerCase().startsWith('about:') ? 'address' : 'search');
        setSelectedIndex(-1);
        if (value.length > 0) {
            try {
                const result = await fetch(`https://google.com/complete/search?client=chrome&hl=ja&ie=utf_8&oe=utf_8&q=${encodeURIComponent(value)}`);
                const data = JSON.parse(await result.text());
                setSuggestResults(data[1]);
            } catch {
                setSuggestResults(await suggest.google(value));
            }
        } else {
            setSuggestResults([]);
        }
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
        console.log(e.key);
        switch (e.key) {
            case 'Escape':
                await destroyDialog();
                return;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const result = index > 0 ? index - 1 : suggestResults.length - 1;
                    setValue(suggestResults[result]);
                    return result;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((index) => {
                    const result = index < suggestResults.length - 1 ? index + 1 : 0;
                    setValue(suggestResults[result]);
                    return result;
                });
                return;
            case 'Enter':
                if (e.keyCode !== 13) return;
                if (isURL(value) && !value.includes('://')) {
                    const url = `http://${value}`;
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await destroyDialog();
                } else if (value.toLowerCase().startsWith('about:')) {
                    const url = value.toLowerCase().includes('blank') ? value : value.replace('about:', `${APPLICATION_PROTOCOL}:`);
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await destroyDialog();
                } else if (!value.includes('://')) {
                    const url = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(value));
                    if (e.shiftKey) {
                        await addView(url, true);
                    } else {
                        await loadView(selectedId, url);
                    }
                    await destroyDialog();
                } else {
                    if (e.shiftKey) {
                        await addView(value, true);
                    } else {
                        await loadView(selectedId, value);
                    }
                    await destroyDialog();
                }
                return;
        }
    };

    return (
        <StyledContainer>
            <SearchPanel type={type} value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
            <ResultPanel>
                {suggestResults.map((result, i) => {
                    const text = result.toLowerCase();
                    const inputtedText = value.toLowerCase();
                    const suggestedText = text.replace(inputtedText, '');

                    return (
                        <ResultItem
                            key={i}
                            selected={selectedIndex === i}
                            icon={type === 'search' ? <SearchOutlined /> : <PublicOutlined />}
                            label={
                                text.startsWith(inputtedText) ? <Fragment>
                                    <b>{inputtedText}</b>{suggestedText}
                                </Fragment> : text
                            }
                        />
                    );
                })}
            </ResultPanel>
        </StyledContainer>
    );
};

import { CalculateOutlined, PublicOutlined, SearchOutlined } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useState } from 'react';
import { APPLICATION_PROTOCOL } from '../../../../../../utils';
import { isURL } from '../../../../../../utils/url';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { Result, ResultType, SuggestData } from '../../interface';
import { ResultItem, ResultPanel } from '../ResultPanel';
import { SearchPanel } from '../SearchPanel';
import { StyledContainer } from './styles';

const suggest = require('node-suggest');

export const Popup = () => {

    const { hideDialog, addView, loadView, getCurrentView } = useElectronAPI();
    const { selectedId } = useViewManagerContext();

    const [value, setValue] = useState('');
    const [type, setType] = useState<ResultType>('suggest');
    const [results, setResults] = useState<Result[]>([]);
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
            try {
                const result = await fetch(`https://google.com/complete/search?client=chrome&hl=ja&ie=utf_8&oe=utf_8&q=${encodeURIComponent(value)}`);
                const data = JSON.parse(await result.text());

                const values = data[1] as string[];
                const types = (data[4]['google:suggesttype'] as string[]).map((type) => type.toLowerCase());
                let suggests: SuggestData[] = [];
                for (let i = 0; i < values.length; i++)
                    suggests.push({ value: values[i], type: types[i] });

                const results = suggests.map((result): Result => ({
                    type: result.type === 'calculator' ? 'calculator' : 'suggest',
                    label: result.value,
                    data: result
                }));
                setResults(results);
            } catch {
                const data: string[] = await suggest.google(value);
                const results = data.map((result): Result => ({
                    type: 'suggest',
                    label: result,
                    data: { value: result, type: 'query' }
                }));
                setResults(results);
            }
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
                    setValue(result.type === 'address' ? result.url!! : result.label);
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                if (value.length < 1 || results.length < 1) return;
                setSelectedIndex((index) => {
                    const i = index < results.length - 1 ? index + 1 : 0;
                    const result = results[i];
                    setValue(result.type === 'address' ? result.url!! : result.label);
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

    return (
        <StyledContainer>
            <SearchPanel type={type} value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
            {results.length > 0 && <ResultPanel>
                {results.map(({ type, label, url, favicon }, i) => {
                    const text = label.toLowerCase();
                    const inputtedText = value.toLowerCase();
                    const suggestedText = text.replace(inputtedText, '');

                    switch (type) {
                        case 'suggest':
                            return (
                                <ResultItem
                                    key={i}
                                    selected={selectedIndex === i}
                                    icon={<SearchOutlined sx={{ width: 'inherit', height: 'inherit' }} />}
                                    label={
                                        text.startsWith(inputtedText) ? <Fragment>
                                            <b>{inputtedText}</b>{suggestedText}
                                        </Fragment> : text
                                    }
                                />
                            );
                        case 'address':
                            return (
                                <ResultItem
                                    key={i}
                                    selected={selectedIndex === i}
                                    icon={favicon ?
                                        <Avatar src={favicon} sx={{ width: 'inherit', height: 'inherit' }} /> :
                                        <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />}
                                    label={label}
                                />
                            );
                        case 'calculator':
                            return (
                                <ResultItem
                                    key={i}
                                    selected={selectedIndex === i}
                                    icon={<CalculateOutlined sx={{ width: 'inherit', height: 'inherit' }} />}
                                    label={
                                        <Fragment>{inputtedText}{'\u00A0'}<b>{suggestedText}</b></Fragment>
                                    }
                                />
                            );
                    }
                })}
            </ResultPanel>}
        </StyledContainer>
    );
};

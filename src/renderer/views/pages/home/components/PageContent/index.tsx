import { Google, PublicOutlined } from '@mui/icons-material';
import { Box, IconButton, InputBase, Popper, useMediaQuery, useTheme } from '@mui/material';
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Logo from '../../../../../../assets/logo.svg';
import { ResultData } from '../../../../../../main/utils/search';
import { APPLICATION_NAME, APPLICATION_PROTOCOL } from '../../../../../../utils';
import { split } from '../../../../../../utils/array';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { Applications, Search } from '../../../../../components/Icons';
import { ResultType } from '../../../../browser/search/interface';
import {
    Page,
    PageContainer,
    PageHeader,
    SearchBoxPaper,
    SuggestItem,
    SuggestItemFavicon,
    SuggestItemIcon,
    SuggestItemTextBlock,
    SuggestPaper
} from './styles';

const filter = (array: ResultData[]) => array.filter((data, i) => array.findIndex(
    ({ title, url }) => title === data.title || url === data.url
) === i);


export const PageContent = () => {
    const [userId, setUserId] = useState('');

    const [value, setValue] = useState('');
    const [type, setType] = useState<ResultType>('suggest');
    const [results, setResults] = useState<ResultData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);

    const { palette: { action }, breakpoints: { values: { sm } } } = useTheme();
    const matches = useMediaQuery(`(min-width: ${sm}px)`);

    const ref = useCallback((element: HTMLInputElement | null) => {
        if (element) {
            element.focus();
            setTimeout(() => element.select());
        }
    }, []);

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);
        });
    }, []);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        const resultType = isURL(inputValue) || inputValue.includes('://') || inputValue.toLowerCase().startsWith('about:') ? 'address' : 'suggest';

        setValue(inputValue);
        setType(resultType);
        setSelectedIndex(-1);

        setAnchorEl(e.currentTarget);

        if (inputValue.length > 0) {
            const searchResult = await window.flast.search(userId, inputValue);
            const bookmarks = split(searchResult.bookmarks, 3);
            const history = split(searchResult.history, 3);
            const userData = filter([...bookmarks, ...history]);
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
                setResults([]);
                return;
            case 'ArrowUp':
                e.preventDefault();
                if (value.length < 1 || results.length < 1) return;
                setSelectedIndex((index) => {
                    const i = index > 0 ? index - 1 : results.length - 1;
                    const result = results[i];
                    setValue(result.resultType === 'search' ? result.title : result.url);
                    return i;
                });
                return;
            case 'ArrowDown':
                e.preventDefault();
                if (value.length < 1 || results.length < 1) return;
                setSelectedIndex((index) => {
                    const i = index < results.length - 1 ? index + 1 : 0;
                    const result = results[i];
                    setValue(result.resultType === 'search' ? result.title : result.url);
                    return i;
                });
                return;
            case 'Enter':
                if (e.keyCode !== 13 || value.length < 1) return;
                if (isURL(value) && !value.includes('://')) {
                    window.location.href = prefixHttp(value);
                } else if (value.toLowerCase().startsWith('about:')) {
                    window.location.href = value.toLowerCase().includes('blank') ? value : value.replace('about:', `${APPLICATION_PROTOCOL}:`);
                } else if (!value.includes('://')) {
                    window.location.href = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(value));
                } else {
                    window.location.href = value;
                }
                return;
        }
    };

    const handleClick = async (e: MouseEvent<HTMLButtonElement>, i: number) => {
        const resultValue = results[i].url;
        if (isURL(resultValue) && !resultValue.includes('://')) {
            window.location.href = prefixHttp(resultValue);
        } else if (resultValue.toLowerCase().startsWith('about:')) {
            window.location.href = resultValue.toLowerCase().includes('blank') ? resultValue : resultValue.replace('about:', `${APPLICATION_PROTOCOL}:`);
        } else if (!resultValue.includes('://')) {
            window.location.href = 'https://www.google.com/search?q=%s'.replace('%s', encodeURIComponent(resultValue));
        } else {
            window.location.href = resultValue;
        }
    };

    return (
        <Page>
            <Helmet title={APPLICATION_NAME} />
            <PageHeader>
                <Box
                    sx={{
                        ml: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}
                >
                    <IconButton>
                        <Applications />
                    </IconButton>
                </Box>
            </PageHeader>
            <PageContainer maxWidth="sm">
                <Box
                    sx={{
                        mt: 7,
                        mb: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4
                    }}
                >
                    <img src={Logo} style={{ width: '50%' }} />
                    <SearchBoxPaper suggestOpen={results.length > 0}>
                        <IconButton disabled sx={{ p: '10px', color: `${action.active} !important` }}>
                            <Google />
                        </IconButton>
                        <InputBase
                            inputRef={ref}
                            value={value}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Google で検索"
                            sx={{ ml: 1, flex: 1 }}
                        />
                        <IconButton type="submit" sx={{ p: '10px' }}>
                            <Search />
                        </IconButton>
                    </SearchBoxPaper>
                </Box>
                <Popper
                    open={results.length > 0}
                    anchorEl={anchorEl}
                    placement="bottom"
                    disablePortal
                    modifiers={[
                        {
                            name: 'offset',
                            options: {
                                offset: [-4, 14]
                            }
                        }
                    ]}
                    sx={{ width: `calc(100% - calc(${matches ? 24 : 16}px * 2))` }}
                >
                    <SuggestPaper>
                        {results.map(({ resultType, title, url, favicon }, i) => {
                            switch (resultType) {
                                case 'search':
                                    return (
                                        <SuggestItem
                                            onClick={(e) => handleClick(e, i)}
                                            sx={{ bgcolor: selectedIndex === i ? 'action.hover' : 'none' }}
                                        >
                                            <SuggestItemIcon icon={<Search />} />
                                            <SuggestItemTextBlock primary={title} />
                                        </SuggestItem>
                                    );
                                default:
                                    return (
                                        <SuggestItem
                                            onClick={(e) => handleClick(e, i)}
                                            sx={{ bgcolor: selectedIndex === i ? 'action.hover' : 'none' }}
                                        >
                                            <SuggestItemIcon
                                                icon={favicon ? <SuggestItemFavicon src={favicon} /> :
                                                    <PublicOutlined />}
                                            />
                                            <SuggestItemTextBlock
                                                primary={title}
                                                secondary={resultType !== 'address' ? decodeURIComponent(url) : undefined}
                                            />
                                        </SuggestItem>
                                    );
                            }
                        })}
                    </SuggestPaper>
                </Popper>
            </PageContainer>
        </Page>
    );
};

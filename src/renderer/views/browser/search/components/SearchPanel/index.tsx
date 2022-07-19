import { PublicOutlined } from '@mui/icons-material';
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { IBookmark } from '../../../../../../interfaces/user';
import { ViewState } from '../../../../../../interfaces/view';
import { prefixHttp } from '../../../../../../utils/url';
import { Search, Share, Star, StarFilled } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import { StyledButton, StyledButtonContainer } from '../../../app/components/AddressBar/styles';
import { ResultType } from '../../interface';
import { StyledIcon, StyledImage, StyledInput, StyledPanel } from './styles';

interface Props {
    type: ResultType;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchPanel = ({ type, value, onChange, onKeyDown }: Props) => {
    const { getBookmarks, addBookmark, removeBookmark } = useElectronAPI();

    const { selectedId, getCurrentViewState } = useViewManagerContext();
    const { userId, config } = useUserConfigContext();

    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        ref.current?.focus();
        ref.current?.select();
    }, []);

    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [icon, setIcon] = useState<string | undefined>(undefined);
    const [bookmark, setBookmark] = useState<IBookmark | undefined>(undefined);

    const navigationState = getCurrentViewState();
    useEffect(() => {
        setState(navigationState);
        (async () => {
            const bookmarks = await getBookmarks(userId);
            setBookmark(bookmarks.find((data) => data.url === navigationState.url));
        })();
    }, [selectedId, navigationState]);

    const handleBookmarkButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (bookmark) {
            await removeBookmark(userId, bookmark._id!!);
        } else {
            await addBookmark(
                userId,
                {
                    title: state.title,
                    url: state.url,
                    favicon: state.favicon,
                    isFolder: false
                }
            );
        }

        const bookmarks = await getBookmarks(userId);
        setBookmark(bookmarks.find((data) => data.url === navigationState.url));
    };

    useEffect(() => {
        if (type === 'address') {
            (async () => {
                try {
                    const url = new URL(prefixHttp(value));

                    // const documentRes = await fetch(url.href);
                    // const document = documentRes.ok ? new DOMParser().parseFromString(await documentRes.text(), 'text/html') : undefined;

                    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}`;
                    const faviconRes = await fetch(faviconUrl);

                    setIcon(faviconRes.ok ? faviconUrl : undefined);
                } catch (e) {
                    setIcon(undefined);
                }
            })();
        } else {
            setIcon(undefined);
        }
    }, [type, value]);

    return (
        <StyledPanel className="panel search-bar" appearanceStyle={config.appearance.style}>
            <StyledIcon>
                {icon ? (<StyledImage src={icon} />) : (type === 'suggest' ?
                    <Search sx={{ width: 'inherit', height: 'inherit' }} /> :
                    <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />)}
            </StyledIcon>
            <StyledInput ref={ref} type="text" placeholder="なんでも検索…"
                         value={value} onChange={onChange} onKeyDown={onKeyDown} />
            <StyledButtonContainer>
                <StyledButton>
                    <Share />
                </StyledButton>
                <StyledButton onClick={handleBookmarkButtonClick}>
                    {bookmark ? <StarFilled /> : <Star />}
                </StyledButton>
            </StyledButtonContainer>
        </StyledPanel>
    );
};

import { PublicOutlined, SearchOutlined } from '@mui/icons-material';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { prefixHttp } from '../../../../../../utils/url';
import { ResultType } from '../../interface';
import { StyledIcon, StyledImage, StyledInput, StyledPanel } from './styles';

interface Props {
    type: ResultType;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchPanel = ({ type, value, onChange, onKeyDown }: Props) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        ref.current?.focus();
    }, []);

    const [icon, setIcon] = useState<string | undefined>(undefined);

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
        <StyledPanel className="panel search-bar">
            <StyledIcon>
                {icon ? (<StyledImage src={icon} />) : (type === 'suggest' ?
                    <SearchOutlined sx={{ width: 'inherit', height: 'inherit' }} /> :
                    <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />)}
            </StyledIcon>
            <StyledInput ref={ref} type="text" placeholder="なんでも検索…"
                         value={value} onChange={onChange} onKeyDown={onKeyDown} />
        </StyledPanel>
    );
};

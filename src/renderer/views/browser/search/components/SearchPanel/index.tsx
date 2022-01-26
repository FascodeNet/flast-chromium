import { PublicOutlined, SearchOutlined } from '@mui/icons-material';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { StyledContainer, StyledIcon, StyledInput, StyledLabel, StyledPanel } from './styles';

interface Props {
    type: 'search' | 'address';
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchPanel = ({ type, value, onChange, onKeyDown }: Props) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <StyledPanel className="popup panel search-bar">
            <StyledIcon>
                {type === 'search' ? <SearchOutlined /> : <PublicOutlined />}
            </StyledIcon>
            <StyledContainer>
                <StyledInput ref={ref} type="text" placeholder="なんでも検索…"
                             value={value} onChange={onChange} onKeyDown={onKeyDown} />
                <StyledLabel>[Shift] + [Enter] で新規タブで開きます。</StyledLabel>
            </StyledContainer>
        </StyledPanel>
    );
};

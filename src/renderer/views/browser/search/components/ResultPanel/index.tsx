import clsx from 'clsx';
import React, { MouseEvent, ReactNode } from 'react';
import {
    StyledItem,
    StyledItemIcon,
    StyledItemLabel,
    StyledItemLabelContainer,
    StyledItemSubLabel,
    StyledPanel
} from './styles';

interface Props {
    children: ReactNode;
}

export const ResultPanel = ({ children }: Props) => {
    return (
        <StyledPanel className="panel search-result">
            {children}
        </StyledPanel>
    );
};

interface ItemProps {
    icon: ReactNode;
    label: ReactNode;
    subLabel?: ReactNode;
    selected: boolean;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const ResultItem = ({ icon, label, subLabel, selected, onClick }: ItemProps) => {
    return (
        <StyledItem className={clsx('search-result-item', selected && 'selected')}
                    selected={selected} subLabel={subLabel !== undefined} onClick={onClick}>
            <StyledItemIcon className="search-result-item-icon">{icon}</StyledItemIcon>
            <StyledItemLabelContainer>
                <StyledItemLabel className="search-result-item-label">{label}</StyledItemLabel>
                {subLabel && <StyledItemSubLabel className="search-result-item-sublabel">
                    {subLabel}
                </StyledItemSubLabel>}
            </StyledItemLabelContainer>
        </StyledItem>
    );
};

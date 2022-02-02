import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { StyledItem, StyledItemIcon, StyledItemLabel, StyledPanel } from './styles';

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
    selected: boolean;
}

export const ResultItem = ({ icon, label, selected }: ItemProps) => {
    return (
        <StyledItem className={clsx('search-result-item', selected && 'selected')} selected={selected}>
            <StyledItemIcon className="search-result-item-icon">{icon}</StyledItemIcon>
            <StyledItemLabel className="search-result-item-label">{label}</StyledItemLabel>
        </StyledItem>
    );
};

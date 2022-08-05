import { PublicOutlined } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import clsx from 'clsx';
import React, { Fragment, MouseEvent, ReactNode } from 'react';
import { DefaultUserConfig, SearchEngine } from '../../../../../../interfaces/user';
import { ResultData } from '../../../../../../main/utils/search';
import { APPLICATION_PROTOCOL } from '../../../../../../utils';
import { isURL, prefixHttp } from '../../../../../../utils/url';
import { Search } from '../../../../../components/Icons';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import {
    StyledItem,
    StyledItemIcon,
    StyledItemLabel,
    StyledItemLabelContainer,
    StyledItemSubLabel,
    StyledPanel
} from './styles';

interface Props {
    value: string;
    selectedIndex: number;
    data: ResultData[];
    engine: SearchEngine | undefined;
    addOrLoadView: (e: MouseEvent<HTMLDivElement>, url: string) => void;
}

export const ResultPanel = ({ value, selectedIndex, data, engine, addOrLoadView }: Props) => {
    const { hideDialog } = useElectronAPI();
    const { config } = useUserConfigContext();

    const handleClick = async (e: MouseEvent<HTMLDivElement>, index: number) => {
        const resultValue = data[index].url;
        if (isURL(resultValue) && !resultValue.includes('://')) {
            const url = prefixHttp(resultValue);
            await addOrLoadView(e, url);
        } else if (resultValue.toLowerCase().startsWith('about:')) {
            const url = resultValue.toLowerCase().includes('blank') ? resultValue : resultValue.replace('about:', `${APPLICATION_PROTOCOL}:`);
            await addOrLoadView(e, url);
        } else if (!resultValue.includes('://')) {
            const searchEngine = config.search.engines[config.search.default_engine] ?? DefaultUserConfig.search.engines[0];
            const url = (engine ?? searchEngine).url.replace('%s', encodeURIComponent(resultValue));
            await addOrLoadView(e, url);
        } else {
            await addOrLoadView(e, resultValue);
        }

        await hideDialog();
    };

    if (!data || data.length < 1)
        return (<Fragment />);

    return (
        <StyledPanel className="panel search-result">
            {data.map(({ resultType, title, url, favicon }, i) => {
                switch (resultType) {
                    case 'search':
                        return (
                            <ResultItem
                                key={i}
                                selected={selectedIndex === i}
                                onClick={(e) => handleClick(e, i)}
                                icon={<Search sx={{ width: 'inherit', height: 'inherit' }} />}
                                label={title}
                            />
                        );
                    default:
                        return (
                            <ResultItem
                                key={i}
                                selected={selectedIndex === i}
                                onClick={(e) => handleClick(e, i)}
                                icon={favicon ?
                                    <Avatar
                                        src={favicon}
                                        variant="square"
                                        sx={{
                                            width: 'inherit',
                                            height: 'inherit',
                                            userSelect: 'none'
                                        }}
                                    />
                                    :
                                    <PublicOutlined sx={{ width: 'inherit', height: 'inherit' }} />
                                }
                                label={title}
                                subLabel={resultType !== 'address' ? decodeURIComponent(url) : undefined}
                            />
                        );
                }
            })}
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

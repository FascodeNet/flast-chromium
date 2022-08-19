import { Box, Checkbox, Link, Typography } from '@mui/material';
import { format } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HistoryData, UserConfig } from '../../../../../../interfaces/user';
import {
    ItemContainer,
    ItemFavicon,
    PageTitle,
    Section,
    SectionContent,
    SectionTitle
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useHistoryContext } from '../../contexts/history';

interface ItemProps {
    data: Required<HistoryData>;

    checked: boolean;
    setChecked: (checked: boolean) => void;
}

const Item = ({ data: { _id, title, url, favicon, updatedAt }, checked, setChecked }: ItemProps) => (
    <ItemContainer sx={{ pl: .5, '&:hover': { bgcolor: 'action.hover' } }}>
        <Checkbox checked={checked} onChange={() => setChecked(!checked)} disableRipple />
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            {format(updatedAt, 'HH:mm')}
        </Typography>
        <Box
            sx={{
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}
        >
            <ItemFavicon src={favicon} size={16} />
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            <Link
                href={url}
                color="inherit"
                underline="hover"
                variant="body1"
                align="left"
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }}
            >
                {title}
            </Link>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                {new URL(url).hostname}
            </Typography>
        </Box>
    </ItemContainer>
);

interface Props {
    title: string;
    filter?: (value: Required<HistoryData>, index: number, array: Required<HistoryData>[]) => boolean;
}

export const ListView = ({ title, filter }: Props) => {

    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { historyGroups } = useHistoryContext();

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((selectedIds) => [...selectedIds, targetId]);
        } else {
            setSelected((selectedIds) => selectedIds.filter((selectedId) => selectedId !== targetId));
        }
    };

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.history;

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const groups = historyGroups.filter(({ list }) => list.some((value, index, array) => !filter || filter(value, index, array)));

    if (!groups || groups.length < 1) {
        return (
            <Fragment>
                <Helmet title={`${title} - ${translateSection.title}`} />
                <PageTitle>{title}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${title} - ${translateSection.title}`} />
            <PageTitle>{title}</PageTitle>
            {groups.map(({ date, formatDate, list }) => (
                <Section key={formatDate}>
                    <SectionTitle>
                        {format(date, 'yyyy/MM/dd (E)', { locale: config.language.language === 'ja' ? ja : enUS })}
                    </SectionTitle>
                    <SectionContent>
                        {list.filter((value, index, array) => {
                            return !filter || filter(value, index, array);
                        }).map((historyData) => (
                            <Item
                                key={historyData._id}
                                data={historyData}
                                checked={selected.includes(historyData._id)}
                                setChecked={(checked) => handleChecked(historyData._id, checked)}
                            />
                        ))}
                    </SectionContent>
                </Section>
            ))}
        </Fragment>
    );
};

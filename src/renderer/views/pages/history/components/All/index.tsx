import { format } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HistoryData, UserConfig } from '../../../../../../interfaces/user';
import { PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useHistoryContext } from '../../contexts/history';
import { HistoryItem } from '../App/styles';

export const All = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

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

    const { historyGroups } = useHistoryContext();

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((selectedIds) => [...selectedIds, targetId]);
        } else {
            setSelected((selectedIds) => selectedIds.filter((selectedId) => selectedId !== targetId));
        }
    };

    if (!historyGroups || historyGroups.length < 1) {
        return (
            <Fragment>
                <Helmet title={`${translateSection.all} - ${translateSection.title}`} />
                <PageTitle>{translateSection.all}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${translateSection.all} - ${translateSection.title}`} />
            <PageTitle>{translateSection.all}</PageTitle>
            {historyGroups.map(({ date, formatDate, history }) => (
                <Section key={formatDate}>
                    <SectionTitle>
                        {format(date, 'yyyy/MM/dd (E)', { locale: config.language.language === 'ja' ? ja : enUS })}
                    </SectionTitle>
                    <SectionContent>
                        {history.map(({ _id, title, url, favicon, updatedAt }: HistoryData) => (
                            <HistoryItem
                                key={_id!!}
                                favicon={favicon}
                                date={updatedAt!!}
                                title={title!!}
                                url={url!!}
                                checked={selected.includes(_id!!)}
                                setChecked={(checked) => handleChecked(_id!!, checked)}
                            />
                        ))}
                    </SectionContent>
                </Section>
            ))}
        </Fragment>
    );
};

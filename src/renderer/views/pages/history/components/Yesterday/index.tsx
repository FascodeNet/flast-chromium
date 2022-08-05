import { format, isYesterday } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HistoryData, UserConfig } from '../../../../../../interfaces/user';
import { PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useHistoryContext } from '../../contexts/history';
import { HistoryItem } from '../App/styles';

export const Yesterday = () => {
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
    const historyGroup = historyGroups.find((data) => isYesterday(data.date));

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((ids) => [...ids, targetId]);
        } else {
            setSelected((ids) => ids.filter((id) => id !== targetId));
        }
    };

    if (!historyGroup) {
        return (
            <Fragment>
                <Helmet title={`${translateSection.yesterday} - ${translateSection.title}`} />
                <PageTitle>{translateSection.yesterday}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${translateSection.yesterday} - ${translateSection.title}`} />
            <PageTitle>{translateSection.yesterday}</PageTitle>
            <Section>
                <SectionTitle>
                    {format(historyGroup.date, 'yyyy/MM/dd (E)', { locale: config.language.language === 'ja' ? ja : enUS })}
                </SectionTitle>
                <SectionContent>
                    {historyGroup.history.map(({ _id, title, url, favicon, updatedAt }: HistoryData) => (
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
        </Fragment>
    );
};

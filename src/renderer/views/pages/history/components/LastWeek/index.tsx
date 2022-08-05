import { format, isWithinInterval, previousSaturday, previousSunday, subWeeks } from 'date-fns';
import { enUS, ja } from 'date-fns/locale';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HistoryData, UserConfig } from '../../../../../../interfaces/user';
import { PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';
import { useHistoryContext } from '../../contexts/history';
import { HistoryItem } from '../App/styles';

export const LastWeek = () => {
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

    const today = new Date();
    const lastWeekStart = previousSunday(subWeeks(today, 1));
    const lastWeekEnd = previousSaturday(today);

    lastWeekStart.setHours(0, 0, 0, 0);
    lastWeekEnd.setHours(23, 59, 59, 999);

    const { historyGroups } = useHistoryContext();
    const lastWeekGroups = historyGroups.filter((historyGroup) => isWithinInterval(historyGroup.date, {
        start: lastWeekStart,
        end: lastWeekEnd
    }));

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((ids) => [...ids, targetId]);
        } else {
            setSelected((ids) => ids.filter((id) => id !== targetId));
        }
    };

    if (!lastWeekGroups || lastWeekGroups.length < 1) {
        return (
            <Fragment>
                <Helmet title={`${translateSection.lastWeek} - ${translateSection.title}`} />
                <PageTitle>{translateSection.lastWeek}</PageTitle>
                <Section>
                    <SectionTitle>{translateSection.notFound}</SectionTitle>
                </Section>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Helmet title={`${translateSection.lastWeek} - ${translateSection.title}`} />
            <PageTitle>{translateSection.lastWeek}</PageTitle>
            {lastWeekGroups.map(({ date, formatDate, history }) => (
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

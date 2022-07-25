import { addDays, format } from 'date-fns';
import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IHistory } from '../../../../../interfaces/user';
import { PageTitle, Section, SectionTitle } from '../../../../components/Page';
import { useTranslateContext } from '../../../../contexts/translate';
import { predicateHistory, useHistoryContext } from '../../contexts/history';
import { HistoryItem } from '../App/styles';

export const Yesterday = () => {
    const { translate } = useTranslateContext();
    const translateSection = translate.pages.histories;

    const yesterday = addDays(new Date(), -1);

    const { categorizedHistories } = useHistoryContext();
    const categorizedHistory = categorizedHistories.find((data) => predicateHistory(data, yesterday));

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((ids) => ids.filter((id) => id !== targetId));
        } else {
            setSelected((ids) => [...ids, targetId]);
        }
    };

    if (!categorizedHistory) {
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
                <SectionTitle>{format(yesterday, 'yyyy/MM/dd')}</SectionTitle>
                {categorizedHistory.histories.map(({ _id, title, url, favicon, updatedAt }: IHistory) => (
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
            </Section>
        </Fragment>
    );
};

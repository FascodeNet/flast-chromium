import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IHistory } from '../../../../../interfaces/user';
import { PageTitle, Section, SectionTitle } from '../../../../components/Page';
import { useTranslateContext } from '../../../../contexts/translate';
import { useHistoryContext } from '../../contexts/history';
import { HistoryItem } from '../App/styles';

export const All = () => {
    const { translate } = useTranslateContext();
    const translateSection = translate.pages.histories;

    const { categorizedHistories } = useHistoryContext();

    const [selected, setSelected] = useState<string[]>([]);

    const handleChecked = (targetId: string, checked: boolean) => {
        if (checked) {
            setSelected((ids) => ids.filter((id) => id !== targetId));
        } else {
            setSelected((ids) => [...ids, targetId]);
        }
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.all} - ${translateSection.title}`} />
            <PageTitle>{translateSection.all}</PageTitle>
            {categorizedHistories.map(({ date, format, histories }) => (
                <Section key={format}>
                    <SectionTitle>{format}</SectionTitle>
                    {histories.map(({ _id, title, url, favicon, updatedAt }: IHistory) => (
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
            ))}
        </Fragment>
    );
};

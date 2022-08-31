import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { PageTitle, Section, SwitchItem } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const SystemAndPerformance = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.systemAndPerformance;

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.user.setConfig(userId, userConfig));
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SwitchItem
                    primary={translateSection.smoothTabSwitching.primary}
                    secondary={translateSection.smoothTabSwitching.secondary}
                    checked={config.system_performance.smooth_tab_switching}
                    setChecked={(smoothTabSwitching) => setUserConfig({ system_performance: { smooth_tab_switching: smoothTabSwitching } })}
                />
            </Section>
        </Fragment>
    );
};

import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, HomeButtonPageMode, StartupPageMode, UserConfig } from '../../../../../interfaces/user';
import { DeepPartial } from '../../../../../utils';
import { PageTitle, RadioItem, Section, SectionContent, SectionTitle, SwitchItem } from '../../../../components/Page';
import { useTranslateContext } from '../../../../contexts/translate';

export const Pages = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.pages;

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.api.getUserConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.api.setUserConfig(userId, userConfig));
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SectionTitle>{translateSection.startup.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.newTab}
                        name="startup"
                        value="new_tab"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.prevSessions}
                        name="startup"
                        value="prev_sessions"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                    <RadioItem<StartupPageMode>
                        primary={translateSection.startup.custom}
                        name="startup"
                        value="custom"
                        selectedValue={config.pages.startup.mode}
                        setSelected={(mode) => setUserConfig({ pages: { startup: { mode } } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.home.title}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translateSection.home.button.name}
                        secondary={translateSection.home.button.description}
                        checked={config.appearance.buttons.home}
                        setChecked={(home) => setUserConfig({ appearance: { buttons: { home } } })}
                    />
                    <RadioItem<HomeButtonPageMode>
                        primary={translateSection.home.newTab}
                        name="home"
                        value="new_tab"
                        selectedValue={config.pages.home.mode}
                        setSelected={(mode) => setUserConfig({ pages: { home: { mode } } })}
                        disabled={!config.appearance.buttons.home}
                    />
                    <RadioItem<HomeButtonPageMode>
                        primary={translateSection.home.custom}
                        name="home"
                        value="custom"
                        selectedValue={config.pages.home.mode}
                        setSelected={(mode) => setUserConfig({ pages: { home: { mode } } })}
                        disabled={!config.appearance.buttons.home}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

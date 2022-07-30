import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { DeepPartial } from '../../../../../utils';
import { PageTitle, Section, SectionContent, SectionTitle, SwitchItem } from '../../../../components/Page';
import { useTranslateContext } from '../../../../contexts/translate';

export const PrivacyAndSecurity = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.privacyAndSecurity;

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
                <SectionTitle>{translateSection.history.title}</SectionTitle>
                <SwitchItem
                    primary={translateSection.history.save}
                    checked={config.privacy_security.save_history}
                    setChecked={(useHistory) => setUserConfig({ privacy_security: { save_history: useHistory } })}
                />
            </Section>
            <Section>
                <SectionTitle>{translateSection.suggests.title}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        primary={translateSection.suggests.search}
                        checked={config.privacy_security.suggests.search}
                        setChecked={(search) => setUserConfig({ privacy_security: { suggests: { search } } })}
                    />
                    <SwitchItem
                        primary={translateSection.suggests.bookmarks}
                        checked={config.privacy_security.suggests.bookmarks}
                        setChecked={(bookmarks) => setUserConfig({ privacy_security: { suggests: { bookmarks } } })}
                    />
                    <SwitchItem
                        primary={translateSection.suggests.history}
                        checked={config.privacy_security.suggests.history}
                        setChecked={(history) => setUserConfig({ privacy_security: { suggests: { history } } })}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

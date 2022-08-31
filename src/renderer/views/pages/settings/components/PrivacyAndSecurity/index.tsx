import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { PageTitle, Section, SectionContent, SectionTitle, SwitchItem } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const PrivacyAndSecurity = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.privacyAndSecurity;

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
                <SectionTitle>{translateSection.privacy.title}</SectionTitle>
                <SwitchItem
                    primary={translateSection.privacy.sendDNTRequest}
                    checked={config.privacy_security.send_dnt_request}
                    setChecked={(sendDNTRequest) => setUserConfig({ privacy_security: { send_dnt_request: sendDNTRequest } })}
                />
            </Section>
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
                        checked={config.search.suggests.search}
                        setChecked={(search) => setUserConfig({ search: { suggests: { search } } })}
                    />
                    <SwitchItem
                        primary={translateSection.suggests.bookmarks}
                        checked={config.search.suggests.bookmarks}
                        setChecked={(bookmarks) => setUserConfig({ search: { suggests: { bookmarks } } })}
                    />
                    <SwitchItem
                        primary={translateSection.suggests.history}
                        checked={config.search.suggests.history}
                        setChecked={(history) => setUserConfig({ search: { suggests: { history } } })}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

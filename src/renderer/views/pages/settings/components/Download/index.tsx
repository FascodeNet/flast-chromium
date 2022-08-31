import { Button } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, UserConfig } from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import {
    ItemContainer,
    ItemFormContainer,
    ItemTextBlock,
    PageTitle,
    Section,
    SwitchItem
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

export const Download = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.download;

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
                <ItemContainer>
                    <ItemTextBlock
                        primary={translateSection.path}
                        secondary={config.download.path}
                    />
                    <ItemFormContainer>
                        <Button variant="contained">
                            選択
                        </Button>
                    </ItemFormContainer>
                </ItemContainer>
                <SwitchItem
                    primary={translateSection.checkPathEvery}
                    checked={config.download.check_path_every}
                    setChecked={(checkPathEvery) => setUserConfig({ download: { check_path_every: checkPathEvery } })}
                />
                <SwitchItem
                    primary={translateSection.checkOperationEvery}
                    checked={config.download.check_operation_every}
                    setChecked={(checkOperationEvery) => setUserConfig({ download: { check_operation_every: checkOperationEvery } })}
                />
            </Section>
        </Fragment>
    );
};

import { IconButton } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { DefaultUserConfig, PermissionDefaultCallback, UserConfig } from '../../../../../../interfaces/user';
import { PermissionType } from '../../../../../../main/session/permission';
import { DeepPartial } from '../../../../../../utils';
import { ArrowLeft } from '../../../../../components/Icons';
import { PermissionIcons } from '../../../../../components/Icons/permissions';
import {
    PageParagraph,
    PageTitle,
    RadioItem,
    Section,
    SectionContent,
    SectionTitle
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

interface Props {
    type: PermissionType;
}

export const SitePermission = ({ type }: Props) => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.sites;
    const translatePermissionSection = translate.permissions[type];

    const icons = PermissionIcons[type];

    useEffect(() => {
        window.flast.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.getUserConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        setConfig(await window.flast.setUserConfig(userId, userConfig));
    };

    const handleSelectCallback = (callback: PermissionDefaultCallback) => {
        const permissions: Record<PermissionType, PermissionDefaultCallback> = config.sites.permissions;
        permissions[type] = callback;
        setUserConfig({ sites: { permissions } });
    };

    return (
        <Fragment>
            <Helmet title={`${translatePermissionSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => navigate('../')}>
                    <ArrowLeft />
                </IconButton>
                <div>{translatePermissionSection.title}</div>
            </PageTitle>
            <PageParagraph>{translatePermissionSection.description}</PageParagraph>
            <Section>
                <SectionTitle>{translateSection.default}</SectionTitle>
                <SectionContent>
                    <RadioItem<PermissionDefaultCallback>
                        icon={icons.enabled}
                        primary={translatePermissionSection.enable}
                        name="default"
                        value="confirm"
                        selectedValue={config.sites.permissions[type]}
                        setSelected={handleSelectCallback}
                    />
                    <RadioItem<PermissionDefaultCallback>
                        icon={icons.disabled}
                        primary={translatePermissionSection.disable}
                        name="default"
                        value="deny"
                        selectedValue={config.sites.permissions[type]}
                        setSelected={handleSelectCallback}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

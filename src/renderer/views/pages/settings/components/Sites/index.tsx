import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { DefaultUserConfig, PermissionDefaultCallback, UserConfig } from '../../../../../../interfaces/user';
import { PermissionType } from '../../../../../../main/session/permission';
import { DeepPartial } from '../../../../../../utils';
import { PermissionIcons } from '../../../../../components/Icons/permissions';
import { LinkItem, PageTitle, Section, SectionContent, SectionTitle } from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

interface PermissionItemProps {
    type: PermissionType;
    permissions: Record<PermissionType, PermissionDefaultCallback>;
    path?: string;
}

const PermissionItem = ({ type, permissions, path }: PermissionItemProps) => {
    const { translate } = useTranslateContext();
    const translateSection = translate.permissions[type];

    const icons = PermissionIcons[type];

    return (
        <LinkItem
            icon={permissions[type] === 'confirm' ? icons.enabled : icons.disabled}
            primary={translateSection.title}
            secondary={permissions[type] === 'confirm' ? translateSection.enable : translateSection.disable}
            href={`./${path ?? type}`}
            route
        />
    );
};

export const Sites = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.sites;
    const translatePermissions = translate.permissions;
    const translateContents = translate.contents;

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
                <SectionTitle>{translateSection.permissions}</SectionTitle>
                <SectionContent>
                    <PermissionItem type="geolocation" permissions={config.sites.permissions} path="location" />
                    <PermissionItem type="camera" permissions={config.sites.permissions} />
                    <PermissionItem type="microphone" permissions={config.sites.permissions} />
                    <PermissionItem type="notifications" permissions={config.sites.permissions} />
                    <PermissionItem type="sensors" permissions={config.sites.permissions} />
                    <PermissionItem type="midi" permissions={config.sites.permissions} />
                    <PermissionItem type="hid" permissions={config.sites.permissions} />
                    <PermissionItem type="serial" permissions={config.sites.permissions} />
                    <PermissionItem
                        type="idle_detection"
                        permissions={config.sites.permissions}
                        path="idle-detection"
                    />
                    <PermissionItem type="clipboard" permissions={config.sites.permissions} />
                    <PermissionItem type="pointer_lock" permissions={config.sites.permissions} path="pointer-lock" />
                    <PermissionItem type="open_external" permissions={config.sites.permissions} path="open-external" />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.contents}</SectionTitle>
                <SectionContent>
                </SectionContent>
            </Section>
        </Fragment>
    );
};

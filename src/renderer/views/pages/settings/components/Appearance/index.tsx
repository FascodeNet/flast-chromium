import { Box, styled } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ThemeBlueManifest from '../../../../../../../static/styles/blue/manifest.json';
import SchemeDarkManifest from '../../../../../../../static/styles/dark/manifest.json';
import ThemeGreenManifest from '../../../../../../../static/styles/green/manifest.json';
import SchemeLightManifest from '../../../../../../../static/styles/light/manifest.json';
import ThemeOrangeManifest from '../../../../../../../static/styles/orange/manifest.json';
import ThemePurpleManifest from '../../../../../../../static/styles/purple/manifest.json';
import ThemeRedManifest from '../../../../../../../static/styles/red/manifest.json';
import ThemeYellowManifest from '../../../../../../../static/styles/yellow/manifest.json';
import {
    AppearanceColorScheme,
    AppearanceStyle,
    AppearanceTheme,
    DefaultUserConfig,
    UserConfig
} from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { isVertical } from '../../../../../../utils/design';
import { Applications, Bookmarks, Download, Extension, History, Home } from '../../../../../components/Icons';
import {
    PageTitle,
    RadioItem,
    Section,
    SectionContent,
    SectionTitle,
    SwitchItem
} from '../../../../../components/Page';
import { useTranslateContext } from '../../../../../contexts/translate';

const ThemeColor = styled(
    Box,
    { shouldForwardProp: (prop) => prop !== 'color' }
)<{ color: string; }>(({ theme, color }) => ({
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: color
}));

export const Appearance = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.appearance;

    useEffect(() => {
        window.flast.user.current().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const userConfig = await window.flast.user.getConfig(id);
            setConfig(userConfig);
        });
    }, []);

    const setUserConfig = async (userConfig: DeepPartial<UserConfig>) => {
        const cfg = await window.flast.user.setConfig(userId, userConfig);
        await window.flast.user.setTheme(userId);
        setConfig(cfg);
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <PageTitle>{translateSection.title}</PageTitle>
            <Section>
                <SectionTitle>{translateSection.colorScheme.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<AppearanceColorScheme>
                        primary={translateSection.colorScheme.system}
                        name="mode"
                        value="system"
                        selectedValue={config.appearance.color_scheme}
                        setSelected={(colorScheme) => setUserConfig({ appearance: { color_scheme: colorScheme } })}
                    />
                    <RadioItem<AppearanceColorScheme>
                        icon={
                            <ThemeColor
                                color={SchemeLightManifest.background_color}
                                sx={{ border: `solid 1px ${SchemeDarkManifest.background_color}` }}
                            />
                        }
                        primary={translateSection.colorScheme.light}
                        name="mode"
                        value="light"
                        selectedValue={config.appearance.color_scheme}
                        setSelected={(colorScheme) => setUserConfig({ appearance: { color_scheme: colorScheme } })}
                    />
                    <RadioItem<AppearanceColorScheme>
                        icon={
                            <ThemeColor
                                color={SchemeDarkManifest.background_color}
                                sx={{ border: `solid 1px ${SchemeLightManifest.background_color}` }}
                            />
                        }
                        primary={translateSection.colorScheme.dark}
                        name="mode"
                        value="dark"
                        selectedValue={config.appearance.color_scheme}
                        setSelected={(colorScheme) => setUserConfig({ appearance: { color_scheme: colorScheme } })}
                    />
                    <SwitchItem
                        primary={translateSection.colorScheme.tabColored}
                        checked={config.appearance.tab_colored}
                        setChecked={(colored) => setUserConfig({ appearance: { tab_colored: colored } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.theme.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<Exclude<AppearanceTheme, null> | 'null'>
                        primary={translate.common.none}
                        name="theme"
                        value="null"
                        selectedValue={config.appearance.theme ?? 'null'}
                        setSelected={() => setUserConfig({ appearance: { theme: null } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemeRedManifest.background_color} />}
                        primary={ThemeRedManifest.name}
                        secondary={ThemeRedManifest.description}
                        name="theme"
                        value="red"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemeOrangeManifest.background_color} />}
                        primary={ThemeOrangeManifest.name}
                        secondary={ThemeOrangeManifest.description}
                        name="theme"
                        value="orange"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemeYellowManifest.background_color} />}
                        primary={ThemeYellowManifest.name}
                        secondary={ThemeYellowManifest.description}
                        name="theme"
                        value="yellow"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemeGreenManifest.background_color} />}
                        primary={ThemeGreenManifest.name}
                        secondary={ThemeGreenManifest.description}
                        name="theme"
                        value="green"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemeBlueManifest.background_color} />}
                        primary={ThemeBlueManifest.name}
                        secondary={ThemeBlueManifest.description}
                        name="theme"
                        value="blue"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                    <RadioItem<AppearanceTheme>
                        icon={<ThemeColor color={ThemePurpleManifest.background_color} />}
                        primary={ThemePurpleManifest.name}
                        secondary={ThemePurpleManifest.description}
                        name="theme"
                        value="purple"
                        selectedValue={config.appearance.theme}
                        setSelected={(theme) => setUserConfig({ appearance: { theme } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.tabPosition.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<AppearanceStyle>
                        primary={translateSection.tabPosition.topSingle}
                        name="style"
                        value="top_single"
                        selectedValue={config.appearance.style}
                        setSelected={(style) => setUserConfig({ appearance: { style } })}
                    />
                    <RadioItem<AppearanceStyle>
                        primary={translateSection.tabPosition.topDouble}
                        name="style"
                        value="top_double"
                        selectedValue={config.appearance.style}
                        setSelected={(style) => setUserConfig({ appearance: { style } })}
                    />
                    <RadioItem<AppearanceStyle>
                        primary={translateSection.tabPosition.left}
                        name="style"
                        value="left"
                        selectedValue={config.appearance.style}
                        setSelected={(style) => setUserConfig({ appearance: { style } })}
                    />
                    <RadioItem<AppearanceStyle>
                        primary={translateSection.tabPosition.right}
                        name="style"
                        value="right"
                        selectedValue={config.appearance.style}
                        setSelected={(style) => setUserConfig({ appearance: { style } })}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.button.title}</SectionTitle>
                <SectionContent>
                    <SwitchItem
                        icon={<Home />}
                        primary={translateSection.button.home}
                        checked={config.appearance.buttons.home}
                        setChecked={(home) => setUserConfig({ appearance: { buttons: { home } } })}
                    />
                    <SwitchItem
                        icon={<Bookmarks />}
                        primary={translateSection.button.bookmarks}
                        checked={config.appearance.buttons.bookmarks}
                        setChecked={(bookmarks) => setUserConfig({ appearance: { buttons: { bookmarks } } })}
                        disabled={isVertical(config.appearance.style)}
                    />
                    <SwitchItem
                        icon={<History />}
                        primary={translateSection.button.history}
                        checked={config.appearance.buttons.history}
                        setChecked={(history) => setUserConfig({ appearance: { buttons: { history } } })}
                        disabled={isVertical(config.appearance.style)}
                    />
                    <SwitchItem
                        icon={<Download />}
                        primary={translateSection.button.downloads}
                        checked={config.appearance.buttons.downloads}
                        setChecked={(downloads) => setUserConfig({ appearance: { buttons: { downloads } } })}
                        disabled={isVertical(config.appearance.style)}
                    />
                    <SwitchItem
                        icon={<Applications />}
                        primary={translateSection.button.applications}
                        checked={config.appearance.buttons.applications}
                        setChecked={(applications) => setUserConfig({ appearance: { buttons: { applications } } })}
                    />
                    <SwitchItem
                        icon={<Extension />}
                        primary={translateSection.button.extensions}
                        checked={config.appearance.buttons.extensions}
                        setChecked={(extensions) => setUserConfig({ appearance: { buttons: { extensions } } })}
                    />
                </SectionContent>
            </Section>
        </Fragment>
    );
};

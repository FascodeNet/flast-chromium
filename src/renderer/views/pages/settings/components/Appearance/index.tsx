import { Box, ButtonBase, buttonClasses, styled, useTheme } from '@mui/material';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';
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
    AppearanceTabContainerPosition,
    AppearanceTabContainerSidePosition,
    AppearanceTheme,
    AppearanceToolbarPosition,
    DefaultUserConfig,
    UserConfig
} from '../../../../../../interfaces/user';
import { DeepPartial } from '../../../../../../utils';
import { isVerticalTabContainer } from '../../../../../../utils/design';
import { Applications, Bookmarks, Download, Extension, History, Home } from '../../../../../components/Icons';
import {
    ItemDisabledProps,
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

const GridButton = styled(
    ButtonBase,
    { shouldForwardProp: (prop) => prop !== 'row' && prop !== 'column' }
)<{ row: string; column: string; }>(({ theme, row, column }) => ({
    margin: theme.spacing(.5),
    gridRow: row,
    gridColumn: column,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    background: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.short
    }),
    [`&.${buttonClasses.disabled}`]: {
        color: theme.palette.action.disabled
    },
    [`&:hover, &.${buttonClasses.focusVisible}`]: {
        background: theme.palette.action.hover
    }
}));

interface RadioItemProps<T> extends ItemDisabledProps {
    children?: ReactNode;
    row: string;
    column: string;
    name: string;
    value: T;
    selectedValue: T;
    setSelected: (value: T) => void;
}

const GridRadioButton = <T, >(
    {
        children,
        row,
        column,
        name,
        value,
        selectedValue,
        setSelected,
        disabled
    }: RadioItemProps<T>
) => {
    const theme = useTheme();

    return (
        <GridButton
            row={row}
            column={column}
            onClick={() => setSelected(value)}
            disabled={disabled}
            sx={{
                background: selectedValue === value ? theme.palette.primary.main : theme.palette.action.hover,
                color: selectedValue === value ? theme.palette.primary.contrastText : 'inherit'
            }}
        >
            {children}
        </GridButton>
    );
};

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

    const isTabContainerSidePositionDisabled = config.appearance.toolbar_position as string !== config.appearance.tab_container.position as string;

    const handleToolbarPositionSelect = (toolbarPosition: AppearanceToolbarPosition, tabContainerPosition: Extract<AppearanceTabContainerPosition, 'top' | 'bottom'>) => setUserConfig(
        {
            appearance: {
                toolbar_position: toolbarPosition,
                tab_container: {
                    position: tabContainerPosition,
                    side: 'default'
                }
            }
        }
    );

    const handleTabContainerPositionSelect = (position: AppearanceTabContainerPosition) => setUserConfig(
        {
            appearance: {
                tab_container: {
                    position,
                    side: 'default'
                }
            }
        }
    );

    const theme = useTheme();

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
                <SectionTitle>{translateSection.toolbar.title}</SectionTitle>
                <SectionTitle variant="h6">{translateSection.toolbar.position.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<AppearanceToolbarPosition>
                        primary={translateSection.toolbar.position.top}
                        name="toolbar"
                        value="top"
                        selectedValue={config.appearance.toolbar_position}
                        setSelected={(position) => handleToolbarPositionSelect(position, 'top')}
                    />
                    <RadioItem<AppearanceToolbarPosition>
                        primary={translateSection.toolbar.position.bottom}
                        name="toolbar"
                        value="bottom"
                        selectedValue={config.appearance.toolbar_position}
                        setSelected={(position) => handleToolbarPositionSelect(position, 'bottom')}
                    />
                </SectionContent>
            </Section>
            <Section>
                <SectionTitle>{translateSection.tabContainer.title}</SectionTitle>
                <SectionTitle variant="h6">{translateSection.tabContainer.position.title}</SectionTitle>
                <SectionContent>
                    <Box
                        sx={{
                            width: 'fit-content',
                            aspectRatio: '1 / 1',
                            p: .5,
                            display: 'grid',
                            gridTemplateRows: '50px 80px 50px',
                            gridTemplateColumns: '50px 80px 50px',
                            border: `solid 1px ${theme.palette.divider}`,
                            borderRadius: 1
                        }}
                    >
                        <GridRadioButton<AppearanceTabContainerPosition>
                            row="1 / 2"
                            column="2 / 3"
                            name="tab_container"
                            value="top"
                            selectedValue={config.appearance.tab_container.position}
                            setSelected={handleTabContainerPositionSelect}
                        >
                            {translateSection.tabContainer.position.top}
                        </GridRadioButton>
                        <GridRadioButton<AppearanceTabContainerPosition>
                            row="3 / 4"
                            column="2 / 3"
                            name="tab_container"
                            value="bottom"
                            selectedValue={config.appearance.tab_container.position}
                            setSelected={handleTabContainerPositionSelect}
                        >
                            {translateSection.tabContainer.position.bottom}
                        </GridRadioButton>
                        <GridRadioButton<AppearanceTabContainerPosition>
                            row="2 / 3"
                            column="1 / 2"
                            name="tab_container"
                            value="left"
                            selectedValue={config.appearance.tab_container.position}
                            setSelected={handleTabContainerPositionSelect}
                        >
                            {translateSection.tabContainer.position.left}
                        </GridRadioButton>
                        <GridRadioButton<AppearanceTabContainerPosition>
                            row="2 / 3"
                            column="3 / 4"
                            name="tab_container"
                            value="right"
                            selectedValue={config.appearance.tab_container.position}
                            setSelected={handleTabContainerPositionSelect}
                        >
                            {translateSection.tabContainer.position.right}
                        </GridRadioButton>
                    </Box>
                </SectionContent>
                <SectionTitle variant="h6">{translateSection.tabContainer.sidePosition.title}</SectionTitle>
                <SectionContent>
                    <RadioItem<AppearanceTabContainerSidePosition>
                        primary={translateSection.tabContainer.sidePosition.default}
                        name="tab_container_side"
                        value="default"
                        selectedValue={config.appearance.tab_container.side}
                        setSelected={(side) => setUserConfig({ appearance: { tab_container: { side } } })}
                        disabled={isTabContainerSidePositionDisabled}
                    />
                    <RadioItem<AppearanceTabContainerSidePosition>
                        primary={translateSection.tabContainer.sidePosition.outside}
                        name="tab_container_side"
                        value="outside"
                        selectedValue={config.appearance.tab_container.side}
                        setSelected={(side) => setUserConfig({ appearance: { tab_container: { side } } })}
                        disabled={isTabContainerSidePositionDisabled}
                    />
                    <RadioItem<AppearanceTabContainerSidePosition>
                        primary={translateSection.tabContainer.sidePosition.inside}
                        name="tab_container_side"
                        value="inside"
                        selectedValue={config.appearance.tab_container.side}
                        setSelected={(side) => setUserConfig({ appearance: { tab_container: { side } } })}
                        disabled={isTabContainerSidePositionDisabled}
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
                        disabled={isVerticalTabContainer(config.appearance.tab_container.position)}
                    />
                    <SwitchItem
                        icon={<History />}
                        primary={translateSection.button.history}
                        checked={config.appearance.buttons.history}
                        setChecked={(history) => setUserConfig({ appearance: { buttons: { history } } })}
                        disabled={isVerticalTabContainer(config.appearance.tab_container.position)}
                    />
                    <SwitchItem
                        icon={<Download />}
                        primary={translateSection.button.downloads}
                        checked={config.appearance.buttons.downloads}
                        setChecked={(downloads) => setUserConfig({ appearance: { buttons: { downloads } } })}
                        disabled={isVerticalTabContainer(config.appearance.tab_container.position)}
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

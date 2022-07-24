import { Checkbox, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import StyleLeft from '../../../../../assets/Appearance_Style_Left.svg';
import StyleRight from '../../../../../assets/Appearance_Style_Right.svg';
import StyleTopDouble from '../../../../../assets/Appearance_Style_Top_Double.svg';
import StyleTopSingle from '../../../../../assets/Appearance_Style_Top_Single.svg';
import { DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { DeepPartial } from '../../../../../utils';
import { Applications, Bookmarks, Download, Extension, History, Home } from '../../../../components/Icons';
import { useTranslateContext } from '../../../../contexts/translate';
import { Section, SwitchItem } from '../App/components';
import { StyledItemContainer, StyledSubTitle, StyledTitle } from '../App/styles';
import { StyledStyleDetail, StyledStyleSelectButton } from './styles';

export const Appearance = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.appearance;

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const config = await window.api.getUserConfig(id);
            setConfig(config);
        });
    }, []);

    const setUserConfig = async (config: DeepPartial<UserConfig>) => {
        const cfg = await window.api.setUserConfig(userId, config);
        await window.api.setTheme(userId);
        setConfig(cfg);
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <StyledTitle>{translateSection.title}</StyledTitle>
            <StyledSubTitle>{translateSection.mode.title}</StyledSubTitle>
            <div style={{
                height: 150,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 8
            }}>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { mode: 'system' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.mode === 'system'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.mode.system}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { mode: 'light' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.mode === 'light'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.mode.light}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { mode: 'dark' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.mode === 'dark'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.mode.dark}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
            </div>
            <StyledSubTitle>{translateSection.theme.title}</StyledSubTitle>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(170px, 1fr))',
                gridTemplateRows: 'repeat(auto-fit, minmax(112px, 1fr))',
                gap: 8
            }}>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { theme: undefined } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.theme === undefined} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.theme.none}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { theme: 'morning_fog' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.theme === 'morning_fog'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.theme.morningFog}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { theme: 'icy_mint' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.theme === 'icy_mint'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.theme.icyMint}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { theme: 'island_getaway' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.theme === 'island_getaway'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.theme.islandGetaway}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
            </div>
            <StyledSubTitle>{translateSection.tabPosition.title}</StyledSubTitle>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '300px 300px',
                gridTemplateRows: '190px 190px',
                gap: 8
            }}>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopSingle}')` }}
                    onClick={() => setUserConfig({ appearance: { style: 'top_single' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.style === 'top_single'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.tabPosition.topSingle}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleTopDouble}')` }}
                    onClick={() => setUserConfig({ appearance: { style: 'top_double' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.style === 'top_double'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.tabPosition.topDouble}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleLeft}')` }}
                    onClick={() => setUserConfig({ appearance: { style: 'left' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.style === 'left'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.tabPosition.left}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
                <StyledStyleSelectButton
                    sx={{ backgroundImage: `url('${StyleRight}')` }}
                    onClick={() => setUserConfig({ appearance: { style: 'right' } })}
                >
                    <StyledStyleDetail>
                        <Checkbox checked={config.appearance.style === 'right'} readOnly disableRipple />
                        <Typography variant="body1">{translateSection.tabPosition.right}</Typography>
                    </StyledStyleDetail>
                </StyledStyleSelectButton>
            </div>
            <Section>
                <StyledSubTitle>{translateSection.button.title}</StyledSubTitle>
                <StyledItemContainer>
                    <SwitchItem
                        icon={<Home />}
                        primary={translateSection.button.home}
                        checked={config.appearance.buttons.home}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { home: checked } } })}
                    />
                    <SwitchItem
                        icon={<Bookmarks />}
                        primary={translateSection.button.bookmarks}
                        checked={config.appearance.buttons.bookmarks}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { bookmarks: checked } } })}
                    />
                    <SwitchItem
                        icon={<History />}
                        primary={translateSection.button.histories}
                        checked={config.appearance.buttons.histories}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { histories: checked } } })}
                    />
                    <SwitchItem
                        icon={<Download />}
                        primary={translateSection.button.downloads}
                        checked={config.appearance.buttons.downloads}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { downloads: checked } } })}
                    />
                    <SwitchItem
                        icon={<Applications />}
                        primary={translateSection.button.applications}
                        checked={config.appearance.buttons.applications}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { applications: checked } } })}
                    />
                    <SwitchItem
                        icon={<Extension />}
                        primary={translateSection.button.extensions}
                        checked={config.appearance.buttons.extensions}
                        setChecked={(checked) => setUserConfig({ appearance: { buttons: { extensions: checked } } })}
                    />
                </StyledItemContainer>
            </Section>
        </Fragment>
    );
};

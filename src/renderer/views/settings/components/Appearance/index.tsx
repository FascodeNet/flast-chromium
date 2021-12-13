import { Checkbox, Typography } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import StyleLeft from '../../../../../assets/Appearance_Style_Left.svg';
import StyleRight from '../../../../../assets/Appearance_Style_Right.svg';
import StyleTopDouble from '../../../../../assets/Appearance_Style_Top_Double.svg';
import StyleTopSingle from '../../../../../assets/Appearance_Style_Top_Single.svg';
import { DefaultUserConfig, UserConfig } from '../../../../../interfaces/user';
import { useTranslateContext } from '../../../../contexts/translate';
import { StyledSubTitle, StyledTitle } from '../App/styles';
import { StyledStyleDetail, StyledStyleSelectButton } from './styles';

export const Appearance = () => {
    const [userId, setUserId] = useState('');
    const [config, setConfig] = useState<UserConfig>(DefaultUserConfig);

    const { translate } = useTranslateContext();
    const translateSection = translate.pages.settings.appearance;

    useEffect(() => {
        window.api.getUser().then(async (id) => {
            if (!id) return;
            setUserId(id);

            const config = await window.api.getUserConfig(id);
            setConfig(config);
        });
    }, []);

    const setUserConfig = async (config: UserConfig | any) => {
        await window.api.setUserConfig(userId, config);
        setConfig(config);
    };

    return (
        <Fragment>
            <Helmet title={`${translateSection.title} - ${translate.pages.settings.title}`} />
            <StyledTitle>{translateSection.title}</StyledTitle>
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
        </Fragment>
    );
};

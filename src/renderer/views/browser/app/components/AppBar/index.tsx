import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { isVerticalTabContainer } from '../../../../../../utils/design';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { ActionBar } from '../ActionBar';
import { AddressBar } from '../AddressBar';
import { NavigationBar } from '../NavigationBar';
import { HorizontalTabContainer } from '../TabContainer';
import { StyledContainer, StyledTabBar, StyledToolBar, StyledWrapper } from './styles';

export const AppBar = () => {
    const { windowApi } = useElectronAPI();

    const {
        config: {
            appearance: {
                toolbar_position: position,
                tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
            }
        }
    } = useUserConfigContext();

    const [maximized, setMaximized] = useState(false);
    const [fullScreened, setFullScreened] = useState(false);

    const requestMaximized = () => {
        windowApi.isMaximized().then((result) => setMaximized(result));
        windowApi.isFullscreen().then((result) => setFullScreened(result));
    };

    useEffect(() => {
        window.addEventListener('resize', requestMaximized);

        return () => {
            window.removeEventListener('resize', requestMaximized);
        };
    }, []);

    return (
        <StyledContainer className="app-bar" position={position} sidePosition={tabContainerSidePosition}>
            <StyledTabBar
                className="tab-bar"
                position={position}
                visible={position as string === tabContainerPosition as string && tabContainerSidePosition !== 'default'}
                trafficLightsPadding={!fullScreened && position === 'top' && tabContainerSidePosition === 'outside' ? 76 : null}
            >
                <HorizontalTabContainer />
            </StyledTabBar>
            <StyledToolBar
                className="tool-bar"
                position={position}
                fullHeight={isVerticalTabContainer(tabContainerPosition) || position as string === tabContainerPosition as string && tabContainerSidePosition === 'default'}
                trafficLightsPadding={!fullScreened ? (position === 'top' && (isVerticalTabContainer(tabContainerPosition) || (tabContainerPosition === 'top' && tabContainerSidePosition === 'default')) ? 87 : (position === 'top' && (tabContainerPosition === 'top' && tabContainerSidePosition === 'inside' || tabContainerPosition === 'bottom') ? 80 : null)) : null}
            >
                <NavigationBar />
                {position as string === tabContainerPosition as string && tabContainerSidePosition === 'default' ? (
                    <StyledWrapper>
                        <AddressBar />
                        <Divider flexItem orientation="vertical" variant="middle" sx={{ gridArea: 'divider' }} />
                        <HorizontalTabContainer />
                    </StyledWrapper>
                ) : (
                    <AddressBar />
                )}
                <ActionBar />
            </StyledToolBar>
        </StyledContainer>
    );
};

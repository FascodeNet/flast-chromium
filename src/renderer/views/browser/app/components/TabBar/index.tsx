import React, { useEffect, useState } from 'react';
import { isHorizontalTabContainer, isVerticalTabContainer } from '../../../../../../utils/design';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useElectronAPI } from '../../../../../utils/electron';
import { HorizontalTabContainer, VerticalTabContainer } from '../TabContainer';
import { StyledHorizontalContainer, StyledVerticalContainer } from './styles';

export const HorizontalTabBar = () => {
    const { windowApi } = useElectronAPI();

    const {
        config: {
            appearance: {
                toolbar_position: position,
                tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
            }
        }
    } = useUserConfigContext();

    const [fullScreened, setFullScreened] = useState(false);

    const requestMaximized = () => {
        windowApi.isFullscreen().then((result) => setFullScreened(result));
    };

    useEffect(() => {
        window.addEventListener('resize', requestMaximized);

        return () => {
            window.removeEventListener('resize', requestMaximized);
        };
    }, []);

    return (
        <StyledHorizontalContainer
            className="horizontal-tab-bar"
            position={tabContainerPosition}
            visible={isHorizontalTabContainer(tabContainerPosition) && position as string !== tabContainerPosition as string && tabContainerSidePosition === 'default'}
            trafficLightsPadding={!fullScreened && position === 'bottom' && tabContainerPosition === 'top' ? 76 : null}
        >
            <HorizontalTabContainer />
        </StyledHorizontalContainer>
    );
};

export const VerticalTabBar = () => {
    const { windowApi } = useElectronAPI();

    const {
        config: {
            appearance: {
                toolbar_position: position,
                tab_container: { position: tabContainerPosition, side: tabContainerSidePosition }
            }
        }
    } = useUserConfigContext();

    const [fullScreened, setFullScreened] = useState(false);

    const requestMaximized = () => {
        windowApi.isFullscreen().then((result) => setFullScreened(result));
    };

    useEffect(() => {
        window.addEventListener('resize', requestMaximized);

        return () => {
            window.removeEventListener('resize', requestMaximized);
        };
    }, []);

    return (
        <StyledVerticalContainer
            className="vertical-tab-bar"
            position={position}
            tabContainerPosition={tabContainerPosition}
            visible={isVerticalTabContainer(tabContainerPosition)}
            fullScreened={fullScreened}
        >
            <VerticalTabContainer extended={false} />
        </StyledVerticalContainer>
    );
};

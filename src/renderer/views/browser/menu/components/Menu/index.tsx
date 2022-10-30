import { FacebookOutlined, QrCode2Outlined, Twitter } from '@mui/icons-material';
import { Divider as MuiDivider, DividerProps, styled } from '@mui/material';
import clsx from 'clsx';
import React, { Dispatch, Fragment, MouseEvent, ReactNode, SetStateAction, useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import Icon from '../../../../../../assets/icon.png';
import {
    APPLICATION_PROTOCOL,
    APPLICATION_WEB_APPLICATIONS,
    APPLICATION_WEB_BOOKMARKS,
    APPLICATION_WEB_DOWNLOADS,
    APPLICATION_WEB_EXTENSIONS,
    APPLICATION_WEB_HISTORY,
    APPLICATION_WEB_HOME,
    APPLICATION_WEB_SETTINGS
} from '../../../../../../constants';
import { ViewState } from '../../../../../../interfaces/view';
import { getTranslate } from '../../../../../../languages/language';
import { replaceShortcut, Shortcuts } from '../../../../../../main/menus/shortcuts';
import { isURL } from '../../../../../../utils/url';
import {
    Add,
    Applications,
    Bookmarks,
    ChevronRight,
    Download,
    Expand,
    Extension,
    Feedback,
    Find,
    Help,
    History,
    Minus,
    Print,
    Remove,
    Settings,
    Share,
    TabAdd,
    WindowAdd,
    WindowIncognito
} from '../../../../../components/Icons';
import { PopupBase, PopupBaseProps } from '../../../../../components/Popup';
import { useUserConfigContext } from '../../../../../contexts/config';
import { useViewManagerContext } from '../../../../../contexts/view';
import { useElectronAPI } from '../../../../../utils/electron';
import {
    StyledItem,
    StyledItemButton,
    StyledItemButtonContainer,
    StyledItemContainer,
    StyledItemIcon,
    StyledItemLabel,
    StyledItemShortcut,
    StyledItemShortcutText,
    StyledPanel,
    StyledPanelContainer
} from './styles';

type Section = 'share' | 'helpAndFeedback' | undefined;

const MenuPopup = styled(
    ({ className, ...props }: PopupBaseProps & { className?: string; }) => <PopupBase
        className={clsx(className, 'popup')}
        {...props}
    />
)<PopupBaseProps>({
    width: 320
});

interface SubMenuProps {
    top: number;
}

const SubMenuPopup = styled(
    MenuPopup,
    { shouldForwardProp: (prop) => prop !== 'top' }
)<SubMenuProps>(({ top }) => ({
    marginBottom: 30,
    position: 'absolute',
    top,
    left: 15
}));

interface ItemProps {
    icon?: ReactNode;
    label: ReactNode;
    shortcut?: ReactNode;

    onClick?: (e: MouseEvent<HTMLDivElement>) => void;

    section?: Section;
    setSection?: Dispatch<SetStateAction<Section>>;
    setSubMenuTop?: Dispatch<SetStateAction<number>>;
}

const Item = ({ icon, label, shortcut, onClick, section, setSection, setSubMenuTop }: ItemProps) => {

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        setSection!!(section);
        setSubMenuTop!!(e.currentTarget.getBoundingClientRect().y - 8);
    };

    return (
        <StyledItem className="menu-item" onClick={setSection && setSubMenuTop ? handleClick : onClick}>
            <StyledItemIcon className="menu-item-icon">{icon}</StyledItemIcon>
            <StyledItemLabel className="menu-item-label">{label}</StyledItemLabel>
            <StyledItemShortcut className="menu-item-shortcut">
                {typeof shortcut === 'string' ? reactStringReplace(shortcut, /([!-~]+)/g, (match) => (
                    <StyledItemShortcutText key={match}>{match}</StyledItemShortcutText>
                )) : shortcut}
            </StyledItemShortcut>
            {setSection && setSubMenuTop &&
                <ChevronRight className="menu-item-nested" sx={{ width: 16, height: 16 }} />}
        </StyledItem>
    );
};

const Divider = (props: DividerProps) => (<MuiDivider flexItem sx={{ my: 1 }} {...props} />);

export const MainMenu = () => {

    const { windowsApi, windowApi, viewsApi, viewApi, popupApi } = useElectronAPI();
    const { getCurrentViewState } = useViewManagerContext();
    const { userId, config } = useUserConfigContext();

    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        updateViewState();
    }, []);

    const translate = getTranslate(config);
    const translateSection = translate.menus.application;

    const [subMenuSection, setSubMenuSection] = useState<Section>(undefined);
    const [subMenuTop, setSubMenuTop] = useState<number>(0);

    const updateViewState = async () => {
        const viewState = await viewsApi.getCurrentView();
        setState(viewState);
        setUrl(viewState.url);
    };

    const handleZoomInClick = async () => {
        const level = await viewApi.zoomIn(state.id);
        setState((prevState) => ({ ...prevState, zoomLevel: level }));
    };

    const handleZoomOutClick = async () => {
        const level = await viewApi.zoomOut(state.id);
        setState((prevState) => ({ ...prevState, zoomLevel: level }));
    };

    const addOrSelectView = async (viewUrl: string) => {
        const views = await viewsApi.getViews();
        const view = views.find((appView) => appView.url.startsWith(viewUrl));
        if (view) {
            await viewsApi.select(view.id);
        } else {
            await viewsApi.add(viewUrl, true);
        }
    };

    const newTab = config.pages.new_tab;
    return (
        <Fragment>
            <MenuPopup>
                <StyledPanel className="panel">
                    <StyledPanelContainer className="panel-container">
                        <Item
                            icon={<TabAdd />}
                            label={translateSection.newTab}
                            shortcut={replaceShortcut(Shortcuts.TAB_ADD)}
                            onClick={() => viewsApi.add(newTab.mode === 'custom' && newTab.url && isURL(newTab.url) ? newTab.url : `${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HOME}`, true)}
                        />
                        <Item
                            icon={<WindowAdd />}
                            label={translateSection.newWindow}
                            shortcut={replaceShortcut(Shortcuts.WINDOW_ADD)}
                            onClick={() => windowsApi.add(userId)}
                        />
                        <Item
                            icon={<WindowIncognito />}
                            label={translateSection.openIncognitoWindow}
                            shortcut={replaceShortcut(Shortcuts.WINDOW_INCOGNITO)}
                            onClick={() => windowsApi.openIncognito(userId)}
                        />
                        <Divider sx={{ mt: 1, mb: 0 }} />
                        <StyledItemContainer>
                            <StyledItemIcon />
                            <StyledItemLabel className="menu-item-label">{translateSection.zoom.label}</StyledItemLabel>
                            <StyledItemButtonContainer>
                                <Divider orientation="vertical" sx={{ m: 0, p: 0 }} />
                                <StyledItemButton
                                    title={translateSection.zoom.zoomOut}
                                    onClick={handleZoomOutClick}
                                    className="menu-item-button"
                                >
                                    <Minus />
                                </StyledItemButton>
                                <div style={{ margin: '0 8px', fontSize: 13, fontWeight: 300 }}>
                                    {Math.round(state.zoomLevel * 100)}%
                                </div>
                                <StyledItemButton
                                    title={translateSection.zoom.zoomIn}
                                    onClick={handleZoomInClick}
                                    className="menu-item-button"
                                >
                                    <Add />
                                </StyledItemButton>
                                <Divider orientation="vertical" sx={{ m: 0, p: 0 }} />
                                <StyledItemButton
                                    title={translateSection.zoom.fullScreen}
                                    onClick={() => windowApi.fullscreen()}
                                    className="menu-item-button"
                                >
                                    <Expand />
                                </StyledItemButton>
                            </StyledItemButtonContainer>
                        </StyledItemContainer>
                        <Divider sx={{ m: 0 }} />
                        <StyledItemContainer>
                            <StyledItemIcon />
                            <StyledItemLabel className="menu-item-label">{translateSection.edit.label}</StyledItemLabel>
                            <StyledItemButtonContainer>
                                <Divider orientation="vertical" sx={{ m: 0, p: 0 }} />
                                <StyledItemButton className="menu-item-button" style={{ width: 68 }}>
                                    {translateSection.edit.cut}
                                </StyledItemButton>
                                <Divider orientation="vertical" sx={{ m: 0, p: 0 }} />
                                <StyledItemButton className="menu-item-button" style={{ width: 68 }}>
                                    {translateSection.edit.copy}
                                </StyledItemButton>
                                <Divider orientation="vertical" sx={{ m: 0, p: 0 }} />
                                <StyledItemButton className="menu-item-button" style={{ width: 68 }}>
                                    {translateSection.edit.paste}
                                </StyledItemButton>
                            </StyledItemButtonContainer>
                        </StyledItemContainer>
                        <Divider sx={{ mt: 0, mb: 1 }} />
                        <Item
                            icon={<Bookmarks />}
                            label={translateSection.bookmarks}
                            shortcut={replaceShortcut(Shortcuts.NAVIGATION_BOOKMARKS)}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_BOOKMARKS}`)}
                        />
                        <Item
                            icon={<History />}
                            label={translateSection.history}
                            shortcut={replaceShortcut(Shortcuts.NAVIGATION_HISTORY)}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_HISTORY}`)}
                        />
                        <Item
                            icon={<Download />}
                            label={translateSection.downloads}
                            shortcut={replaceShortcut(Shortcuts.NAVIGATION_DOWNLOADS)}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_DOWNLOADS}`)}
                        />
                        <Item
                            icon={<Applications />}
                            label={translateSection.applications}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_APPLICATIONS}`)}
                        />
                        <Item
                            icon={<Extension />}
                            label={translateSection.extensions}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_EXTENSIONS}`)}
                        />
                        <Divider />
                        <Item
                            icon={<Print />}
                            label={translateSection.print}
                            shortcut={replaceShortcut(Shortcuts.PRINT)}
                        />
                        <Item
                            icon={<Find />}
                            label={translateSection.find}
                            shortcut={replaceShortcut(Shortcuts.FIND_1)}
                            onClick={() => popupApi.viewFind()}
                        />
                        <Item
                            icon={<Share />}
                            label={translateSection.share.label}
                            section="share"
                            setSection={setSubMenuSection}
                            setSubMenuTop={setSubMenuTop}
                        />
                        <Divider />
                        <Item
                            icon={<Settings />}
                            label={translateSection.settings}
                            shortcut={replaceShortcut(Shortcuts.SETTINGS)}
                            onClick={() => addOrSelectView(`${APPLICATION_PROTOCOL}://${APPLICATION_WEB_SETTINGS}`)}
                        />
                        <Item
                            icon={<Help />}
                            label={translateSection.helpAndFeedback.label}
                            section="helpAndFeedback"
                            setSection={setSubMenuSection}
                            setSubMenuTop={setSubMenuTop}
                        />
                        <Item icon={<Remove />} label={translateSection.close} />
                    </StyledPanelContainer>
                </StyledPanel>
            </MenuPopup>

            {subMenuSection === 'share' && <ShareMenu top={subMenuTop} />}
            {subMenuSection === 'helpAndFeedback' && <HelpAndFeedbackMenu top={subMenuTop} />}
        </Fragment>
    );
};

export const ShareMenu = ({ top }: SubMenuProps) => {

    const { windowApi, viewsApi, viewApi, popupApi } = useElectronAPI();
    const { getCurrentViewState } = useViewManagerContext();
    const { config } = useUserConfigContext();

    const [state, setState] = useState<ViewState>(getCurrentViewState());
    const [url, setUrl] = useState<string>('');

    const currentView = viewsApi.getCurrentView();
    useEffect(() => {
        (async () => {
            const viewState = await currentView;
            setState(viewState);
            setUrl(viewState.url);
        })();
    }, [currentView]);

    const translate = getTranslate(config);
    const translateSection = translate.menus.application.share;

    return (
        <SubMenuPopup top={top}>
            <StyledPanel className="panel">
                <StyledPanelContainer className="panel-container">
                    <Item
                        icon={<Twitter />}
                        label={translateSection.twitter}
                        onClick={() => viewsApi.add(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(state.title)}`, true)}
                    />
                    <Item
                        icon={<FacebookOutlined />}
                        label={translateSection.facebook}
                        onClick={() => viewsApi.add(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, true)}
                    />
                    <Divider />
                    <Item label={translateSection.copyLink} />
                    <Item icon={<QrCode2Outlined />} label={translateSection.qrCode} />
                </StyledPanelContainer>
            </StyledPanel>
        </SubMenuPopup>
    );
};

export const HelpAndFeedbackMenu = ({ top }: SubMenuProps) => {
    const { config } = useUserConfigContext();

    const translate = getTranslate(config);
    const translateSection = translate.menus.application.helpAndFeedback;

    return (
        <SubMenuPopup top={top}>
            <StyledPanel className="panel">
                <StyledPanelContainer className="panel-container">
                    <Item
                        icon={<Help />}
                        label={translateSection.help}
                        shortcut={<StyledItemShortcutText>{Shortcuts.HELP}</StyledItemShortcutText>}
                    />
                    <Divider />
                    <Item
                        icon={<Feedback />}
                        label={translateSection.feedback}
                        shortcut={replaceShortcut(Shortcuts.FEEDBACK)}
                    />
                    <Divider />
                    <Item label={translateSection.whatsNewAndHint} />
                    <Item
                        icon={<img src={Icon} width={20} height={20} />}
                        label={translateSection.about}
                    />
                </StyledPanelContainer>
            </StyledPanel>
        </SubMenuPopup>
    );
};

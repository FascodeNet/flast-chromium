import anime from 'animejs';
import { ViewState } from '../../interfaces/view';

export const TAB_MAX_WIDTH = 240;
export const TAB_MIN_WIDTH = 72;
export const TAB_PINNED_WIDTH = 34;
export const TAB_ANIMATION_DURATION = 200;
export const TABS_PADDING = 8;

export const ADD_TAB_BUTTON_WIDTH = 28;
export const ADD_TAB_BUTTON_HEIGHT = 28;

export const getWidth = (containerWidth: number, view: ViewState, views: ViewState[]) => {
    if (view.isPinned) return TAB_PINNED_WIDTH;

    const pinnedTabs = views.filter((v) => v.isPinned).length;
    const normalTabs = views.length - pinnedTabs;

    const width = (containerWidth - pinnedTabs * (TAB_PINNED_WIDTH + TABS_PADDING)) / normalTabs - TABS_PADDING / normalTabs;
    return Math.max(TAB_MIN_WIDTH, Math.min(TAB_MAX_WIDTH, width));
};

export const getLeft = (containerWidth: number, view: ViewState, views: ViewState[]) => {
    const index = views.findIndex((v) => v.id === view.id);

    let left = 0;
    for (let i = 0; i < index; i++)
        left += getWidth(containerWidth, views[i], views) + TABS_PADDING;

    return left;
};

export const setTabsBounds = (containerWidth: number, views: ViewState[], animation: boolean = true) => {
    setTabsWidths(containerWidth, views, animation);
    setTabsLefts(containerWidth, views, animation);
};

export const setTabsWidths = (containerWidth: number, views: ViewState[], animation: boolean = true) => {
    for (const view of views) {
        animateTab(
            'width',
            getWidth(containerWidth, view, views),
            `.horizontal-tab-item-${view.id}`,
            animation
        );
    }
};

export const setTabsLefts = (containerWidth: number, views: ViewState[], animation: boolean = true) => {
    let left = 0;
    for (const view of views) {
        animateTab(
            'translateX',
            getLeft(containerWidth, view, views),
            `.horizontal-tab-item-${view.id}`,
            animation
        );

        left += getWidth(containerWidth, view, views) + TABS_PADDING;
    }

    animateTab(
        'translateX',
        Math.min(left, containerWidth + TABS_PADDING),
        '.add-tab-button',
        animation
    );
};

export const animateTab = (property: 'translateX' | 'width', value: number, domElement: any, animation: boolean) => {
    if (animation) {
        anime({
            targets: domElement,
            [property]: value,
            duration: TAB_ANIMATION_DURATION,
            easing: 'easeOutCirc'
        });
    } else {
        anime.set(domElement, { [property]: value });
    }
};

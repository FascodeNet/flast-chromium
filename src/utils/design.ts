import { AppearanceTabContainerPosition } from '../interfaces/user';

/**
 * タブコンテナを縦長で表示しているかどうか
 *
 * @param {AppearanceTabContainerPosition} position
 * @returns {boolean}
 */
export const isVerticalTabContainer = (position: AppearanceTabContainerPosition) => position === 'left' || position === 'right';

/**
 * タブコンテナを横長で表示しているかどうか
 *
 * @param {AppearanceTabContainerPosition} position
 * @returns {boolean}
 */
export const isHorizontalTabContainer = (position: AppearanceTabContainerPosition) => !isVerticalTabContainer(position);

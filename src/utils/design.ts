import {
    WINDOW_DOUBLE_TITLE_BAR_HEIGHT,
    WINDOW_DOUBLE_TOOL_BAR_HEIGHT,
    WINDOW_SINGLE_LENGTH
} from '../constants/design';
import { AppearanceStyle } from '../interfaces/user';

export const getHeight = (style: AppearanceStyle) => isDouble(style) ? WINDOW_DOUBLE_TITLE_BAR_HEIGHT + WINDOW_DOUBLE_TOOL_BAR_HEIGHT : WINDOW_SINGLE_LENGTH;
export const isHorizontal = (style: AppearanceStyle) => !isVertical(style);
export const isVertical = (style: AppearanceStyle) => style === 'left' || style === 'right';
export const isSingle = (style: AppearanceStyle) => !isDouble(style);
export const isDouble = (style: AppearanceStyle) => style === 'top_double' || style === 'bottom_double';

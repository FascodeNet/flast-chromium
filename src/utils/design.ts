import { WINDOW_TITLE_BAR_HEIGHT, WINDOW_TOOL_BAR_HEIGHT } from '../constants/design';
import { AppearanceStyle } from '../interfaces/user';

export const getHeight = (style: AppearanceStyle) => style === 'top_double' ? WINDOW_TITLE_BAR_HEIGHT + WINDOW_TOOL_BAR_HEIGHT : 50;
export const isHorizontal = (style: AppearanceStyle) => !isVertical(style);
export const isVertical = (style: AppearanceStyle) => style === 'left' || style === 'right';

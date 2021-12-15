import { app, MenuItem, MenuItemConstructorOptions, nativeImage, nativeTheme } from 'electron';

export const joinTo = (
    itemsArray: (MenuItem | MenuItemConstructorOptions | (MenuItem | MenuItemConstructorOptions)[] | undefined)[],
    sep: MenuItem | MenuItemConstructorOptions | null = { type: 'separator' }
): (MenuItem | MenuItemConstructorOptions)[] => {
    const list: (MenuItem | MenuItemConstructorOptions)[] = [];

    const length = itemsArray.length;
    for (let i = 0; i < length; i++) {
        const items = itemsArray[i];
        if (!items) continue;

        if (Array.isArray(items)) {
            list.push(...items);
        } else {
            list.push(items);
        }

        if (i < (length - 1) && sep)
            list.push(sep);
    }

    return list;
};

const emptyMenuItemIcon = nativeImage.createFromPath(`${app.getAppPath()}/static/icons/empty.png`).resize({ height: 24 });
export const getMenuItemIcon = (path: string) => nativeImage.createFromPath(path).resize({ height: 24 });
export const getMenuItemIconFromName = (name: string) => getMenuItemIcon(`${app.getAppPath()}/static/icons/${nativeTheme.shouldUseDarkColors ? 'white' : 'black'}/${name}.png`);
export const getEmptyMenuItemIcon = () => emptyMenuItemIcon;

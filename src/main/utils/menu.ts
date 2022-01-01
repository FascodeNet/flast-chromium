import {
    app,
    MenuItem,
    MenuItemConstructorOptions,
    NativeImage,
    nativeImage,
    nativeTheme,
    ResizeOptions
} from 'electron';

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


export const resizeIcon = (image: NativeImage, options: ResizeOptions = { height: 20 }) => image.resize(options);

export const getMenuItemIcon = (path: string) => resizeIcon(nativeImage.createFromPath(path));
export const getMenuItemIconFromName = (name: string) => getMenuItemIcon(`${app.getAppPath()}/static/icons/${nativeTheme.shouldUseDarkColors ? 'white' : 'black'}/${name}.png`);

const emptyMenuItemIcon = getMenuItemIcon(`${app.getAppPath()}/static/icons/empty.png`);
export const getEmptyMenuItemIcon = () => emptyMenuItemIcon;

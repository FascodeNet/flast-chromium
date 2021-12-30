import { Rectangle, WebPreferences } from 'electron';

type BoundsDisposition = 'move' | 'resize';

export interface IDialog {
    name: string;
    bounds?: Partial<Rectangle>;
    onWindowBoundsUpdate?: (disposition: BoundsDisposition) => void;
    onHide?: () => void;
    webPreferences?: WebPreferences;
}

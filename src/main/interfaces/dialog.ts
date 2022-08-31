import { Rectangle, WebPreferences } from 'electron';
import { Dialog } from '../dialogs/dialog';

type BoundsDisposition = 'move' | 'resize';

export interface IDialog {
    name: string;
    bounds?: Partial<Rectangle>;
    onWindowBoundsUpdate?: (dialog: Dialog, disposition: BoundsDisposition) => void;
    onHide?: (dialog: Dialog) => void;
    webPreferences?: WebPreferences;
}

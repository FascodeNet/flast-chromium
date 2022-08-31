import { Rectangle } from 'electron';

export interface ViewBoundsMapping {
    default: Rectangle;

    topSingle?: Rectangle;
    topDouble?: Rectangle;
    bottomSingle?: Rectangle;
    bottomDouble?: Rectangle;
    left?: Rectangle;
    right?: Rectangle;
}

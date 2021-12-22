interface DOMRectangle {
    readonly width: number;
    readonly height: number;
    readonly top: number;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
    readonly x: number;
    readonly y: number;

    toJSON(): any;
}

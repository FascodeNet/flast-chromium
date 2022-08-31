declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';

declare namespace JSX {
    interface IntrinsicElements {
        'browser-action-list': {
            partition?: string;
            tab?: string;
        };
    }
}

export interface AppWindowInitializerOptions {
    urls: string[];
    active: boolean;
}

export const DefaultAppWindowInitializerOptions: AppWindowInitializerOptions = {
    urls: ['https://www.google.com'],
    active: true
};

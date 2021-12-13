import { injectBrowserAction } from 'electron-chrome-extensions/dist/browser-action';

if (location.pathname.endsWith('/app.html')) {
    injectBrowserAction();
}

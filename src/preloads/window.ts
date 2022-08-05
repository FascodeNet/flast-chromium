import { injectBrowserAction } from 'electron-chrome-extensions/dist/browser-action';

if (window.location.pathname.endsWith('/app.html'))
    injectBrowserAction();

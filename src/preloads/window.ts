import { injectBrowserAction } from 'electron-chrome-extensions-production/dist/browser-action';

if (window.location.pathname.endsWith('/app.html'))
    injectBrowserAction();

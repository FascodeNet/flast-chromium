import { Extension } from 'electron';
import Manifest = chrome.runtime.Manifest;

export interface IExtension extends Extension {
    manifest: Manifest;
}

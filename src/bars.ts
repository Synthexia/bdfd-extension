import {
    languages,
    extensions
} from "vscode";
import * as l from './locale';

const bar = languages.createLanguageStatusItem;

export default function languageStatusBars() {
    // Extension Version Bar
    const version = extensions.getExtension('nightnutsky.bdfd-bds')?.packageJSON.version;
    const extensionVersionBar = bar('bdfd-lsi-version', { language: 'bds' });
    extensionVersionBar.name = 'BDFD Extension';
    extensionVersionBar.text = version;
    extensionVersionBar.detail = l.bars.version.text;

    // Customize Highlighting Bar
    const customizeHighlightingBar = bar('bdfd-lsi-customize', { language: 'bds' });
    customizeHighlightingBar.name = 'BDFD Extension';
    customizeHighlightingBar.text = l.bars.customize.text;
    customizeHighlightingBar.command = {
        title: l.bars.customize.commandTitle,
        command: 'bdfd.tokencolors'
    };


    // Sync Bar
    const syncBar = bar('bdfd-lsi-sync', { language: 'bds' });
    syncBar.name = 'BDFD Extension';
    syncBar.text = '(E) Sync feature enabled';
    syncBar.command = {
        title: 'Modify Command Data',
        command: 'bdfd.sync.modifyCommandData'
    };
}
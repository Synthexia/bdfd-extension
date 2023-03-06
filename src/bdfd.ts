import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as completions from './autocompletions/completions';
import languageStatusBars from './bars';
import * as sync from './sync';

// Localization
import * as l from './locale';

// Shortcuts
const cmds = vscode.commands,
win = vscode.window,
info = win.showInformationMessage,
error = win.showErrorMessage,
warn = win.showWarningMessage,
ext = vscode.extensions,
work = vscode.workspace,
target = vscode.ConfigurationTarget.Global,
g_cfg = work.getConfiguration('').get;


exports.activate = features;

function features(context: vscode.ExtensionContext) {
    bdfdFuncList(context);
    tokenColors(context);
    experiments();
    cmu(context);
}

// Only for BDFD FL
let array: any;

// Language Status Bars
const bar = vscode.languages.createLanguageStatusItem;
// Function List Bar (Dynamic)
const functions_bar = bar('bdfd-lsi-functions', { language: 'bds' });
functions_bar.name = 'BDFD Extension';
functions_bar.text = l.bars.funcList.text;
functions_bar.command = {
    title: l.bars.funcList.commandTitle,
    command: 'bdfd.funclist'
};
// Another Bars (Static)
languageStatusBars(bar, vscode.extensions, vscode.languages, completions, l);
// Another Bars (Half-Statis):
// 1. Completions Bar | is being loaded from Completions

// BDFD Function List
function bdfdFuncList(context: vscode.ExtensionContext) {
    try {
        // API Request
        fetch('https://botdesignerdiscord.com/public/api/function_tag_list')
            .then(async (value) => {
                array = await value.json();

                // Register
                const disposable = cmds.registerCommand('bdfd.funclist', quickPickList);
                context.subscriptions.push(disposable);

                info(l.funcList.load.s);
            });
    } catch (e) {
        error(`${l.funcList.load.f}: ${e}`);
    }
}

// Quick Pick For BDFD Function List
function quickPickList() {
    win.showQuickPick(array, { matchOnDetail: true, placeHolder: l.funcList.quickPick.select })
        .then(async (value) => {
            if (value != undefined) {
                const str = value;
                // API Request`
                functions_bar.busy = true;
                await fetch(`https://botdesignerdiscord.com/public/api/function/${value}`)
                    .then(async (value) => {
                        if (value.status == 200) {
                            const data = await value.json(),
                                message = `${data.tag} > ${data.shortDescription} | ${l.funcList.quickPick.intents}: ${data.intents}, ${l.funcList.quickPick.premium}: ${data.premium}`;
    
                            // Show Function Info
                            info(message, l.funcList.quickPick.openWiki)
                                .then((value) => {
                                    if (value == l.funcList.quickPick.openWiki) {
                                        if (typeof str == 'string') {
                                            let end = str.length;
                                            if (str[end - 1] == ']') {
                                                end -= 2;
                                            };
    
                                            const functionTag_formatted = str.substring(1, end),
                                                wiki = `https://nilpointer-software.github.io/bdfd-wiki/nightly/bdscript/${functionTag_formatted}.html`;
                                            cmds.executeCommand('simpleBrowser.show', wiki);
                                        };
                                    };
                                });
                        } else {
                            error(l.funcList.quickPick.fetchError(value.status));
                        };
                        functions_bar.busy = false;
                    });
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

// Color Customization
function tokenColors(context: vscode.ExtensionContext) {
    const disposableResetColors = cmds.registerCommand('bdfd.resettokencolors', resetColors);
    const disposableSetColors = cmds.registerCommand('bdfd.tokencolors', quickPickColors);
    context.subscriptions.push(disposableSetColors, disposableResetColors);
}

// Quick Pick For Color Customization
async function quickPickColors() {
    // Map
    const jsonArray: any = ext.getExtension('nightnutsky.bdfd-bds')?.packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;
    const textMateRulesMap: string[] = jsonArray.map((jsonArray: any) => ({
        description: `${l.customize.quickPick.foreground.color}: ${jsonArray.settings.foreground} | ${l.customize.quickPick.font.style}: ${jsonArray.settings.fontStyle}`,
        colorForeground: jsonArray.settings.foreground,
        colorFontStyle: jsonArray.settings.fontStyle,
        scope: jsonArray.scope,
        label: jsonArray.name
    }));

    // Quick Pick
    win.showQuickPick(textMateRulesMap, { matchOnDetail: true })
        .then((value: any) => {
            const options = {
                colorForeground: value.colorForeground,
                colorFontStyle: value.colorFontStyle,
                scope: value.scope,
                label: value.name
            };

            win.showQuickPick([
                { label: l.customize.quickPick.foreground.foreground, description: l.customize.quickPick.foreground.change },
                { label: l.customize.quickPick.font.font, description: l.customize.quickPick.font.change }
            ])
                .then((value) => {
                     if (typeof value != 'undefined') {
                        const tokens = work.getConfiguration('editor.tokenColorCustomizations');
                        let modified;

                        switch (value.label) {
                            // Foreground
                            case l.customize.quickPick.foreground.foreground:
                                win.showInputBox({ title: l.customize.quickPick.foreground.changing, value: options.colorForeground, placeHolder: `${l.customize.quickPick.general.example}: #FFFFFF` })
                                    .then((value) => {
                                        tokens.textMateRules.forEach((x: any) => {
                                            if (x.scope == `${options.scope}`) {
                                                x.settings.foreground = `${value}`;
                                            };
                                        });
                                        modified = tokens.textMateRules;
                            
                                        work.getConfiguration('editor').update('tokenColorCustomizations', {
                                            textMateRules: modified
                                        }, target);
                                    });
                                break;
                                // Font
                                case l.customize.quickPick.font.font:
                                    // ! Input Box
                                    win.showInputBox({ title: l.customize.quickPick.font.changing, value: options.colorFontStyle, placeHolder: `${l.customize.quickPick.general.example}: bold italic underline` })
                                        .then((value) => {
                                            tokens.textMateRules.forEach((x: any) => {
                                                if (x.scope == `${options.scope}`) {
                                                    x.settings.fontStyle = `${value}`;
                                                };
                                            });
                                            modified = tokens.textMateRules;

                                            work.getConfiguration('editor').update('tokenColorCustomizations', {
                                                textMateRules: modified
                                            }, target);
                                        });
                                    break;
                        };
                     };
                });
        });
}

// Reset Colors To Default
function resetColors() {
    const reset = ext.getExtension('nightnutsky.bdfd-bds')?.packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;

    // Reset
    work.getConfiguration('editor').update('tokenColorCustomizations', {
        textMateRules: reset.textMateRules
    }, target);
}

// Context Menu Utils
function cmu(context: vscode.ExtensionContext) {
    // Listener
    win.onDidChangeTextEditorSelection(listener);
    function listener() {
        let selection = win.activeTextEditor?.selection;
        return <vscode.Selection>selection;
    };

    // Escape Action
    const disposable = cmds.registerCommand('bdfd.utils.escape', escape);
    function escape() {
        win.activeTextEditor?.edit((edit: vscode.TextEditorEdit) => {
            const content = win.activeTextEditor?.document.getText(listener());
            const replaced = <string>content?.replaceAll('\\', '\\\\').replaceAll(']', '\\]').replaceAll('$', '%{DOL}%').replaceAll(';', '\\;');
            edit.replace(listener(), replaced);
        });
    };

    context.subscriptions.push(disposable);
}

// ! Experiments
// Experiments Loader
function experiments() {
    // Snippets
    if (g_cfg('BDFD.experiments.autoCompletions')) {
        completions.load();
        console.info(l.general.experimentsLoader.completions);
    };
    // Sync
    if (g_cfg('BDFD.experiments.sync')) {
        sync.load();
        console.info(l.general.experimentsLoader.sync);
    }
}
import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as completions from './autocompletions/completions';
import languageStatusBars from './bars';
import * as sync from './sync';
import type {
    TextMateRules,
    TextMateRulesQuickPick
} from './types';

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
    bdfdFunctionList(context);
    registerCustomizations(context);
    contextMenuUtils(context);

    loadExperiments();
}

// Dynamic Bar
const bdfdFunctionListBar = vscode.languages.createLanguageStatusItem('bdfd-lsi-functions', { language: 'bds' });
bdfdFunctionListBar.name = 'BDFD Extension';
bdfdFunctionListBar.text = l.bars.funcList.text;
bdfdFunctionListBar.command = {
    title: l.bars.funcList.commandTitle,
    command: 'bdfd.funclist'
};
// Static Bars
languageStatusBars();

// BDFD Function List
function bdfdFunctionList(context: vscode.ExtensionContext) {
    try {
        fetch('https://botdesignerdiscord.com/public/api/function_tag_list').then(async (value) => {
            const items = await value.json() as string[];

            const disposable = cmds.registerCommand('bdfd.funclist', quickPick);
            context.subscriptions.push(disposable);

            info(l.funcList.load.s);

            function quickPick() {
                win.showQuickPick(items, { matchOnDetail: true, placeHolder: l.funcList.quickPick.select }).then(async (value) => {
                    if (value) {
                        const str = value;
                        bdfdFunctionListBar.busy = true;

                        await fetch(`https://botdesignerdiscord.com/public/api/function/${value}`).then(async (value) => {
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
                            bdfdFunctionListBar.busy = false;
                        });
                    } else {
                        warn(l.general.actionCancelled);
                    };
                });
            }
        });
    } catch (e) {
        error(`${l.funcList.load.f}: ${e}`);
    };
}

// Register Token Customizations Command
function registerCustomizations(context: vscode.ExtensionContext) {
    const resetCustomizations = cmds.registerCommand('bdfd.resettokencolors', resetCustomization);
    const setCustomizations = cmds.registerCommand('bdfd.tokencolors', quickPickCustomizations);
    context.subscriptions.push(resetCustomizations, setCustomizations);
}

// Customizations
async function quickPickCustomizations() {
    const textMateRules: TextMateRules[] = ext.getExtension('nightnutsky.bdfd-bds')?.packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;
    let textMateRulesQuickPick: TextMateRulesQuickPick[] = [];

    for (let i = 0; i < textMateRules.length; i++) {
        if (textMateRules[i].name != 'Formatting') {
            textMateRulesQuickPick.push({
                description: `${l.customize.quickPick.foreground.color}: ${textMateRules[i].settings.foreground ?? 'No foreground color'} | ${l.customize.quickPick.font.style}: ${textMateRules[i].settings.fontStyle ?? 'No font style'}`,
                foreground: textMateRules[i].settings.foreground,
                fontStyle: textMateRules[i].settings.fontStyle,
                scope: textMateRules[i].scope,
                label: textMateRules[i].name
            });
        };
    };

    win.showQuickPick(textMateRulesQuickPick, { matchOnDetail: true }).then((value) => {
        const options = {
            foreground: value?.foreground,
            fontStyle: value?.fontStyle,
            scope: value?.scope,
            label: value?.name
        };

        win.showQuickPick([
            { label: l.customize.quickPick.foreground.foreground, description: l.customize.quickPick.foreground.change },
            { label: l.customize.quickPick.font.font, description: l.customize.quickPick.font.change }
        ]).then((value) => {
            if (value) {
                const tokens = work.getConfiguration('editor.tokenColorCustomizations');
                let modified;

                switch (value.label) {
                    // Foreground
                    case l.customize.quickPick.foreground.foreground:
                        win.showInputBox({ title: l.customize.quickPick.foreground.changing, value: options.foreground, placeHolder: `${l.customize.quickPick.general.example}: #FFFFFF` }).then((value) => {
                            tokens.textMateRules.forEach((x: TextMateRules) => {
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
                        win.showInputBox({ title: l.customize.quickPick.font.changing, value: options.fontStyle, placeHolder: `${l.customize.quickPick.general.example}: bold italic underline` }).then((value) => {
                            tokens.textMateRules.forEach((x: TextMateRules) => {
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

// Reset Customizations
function resetCustomization() {
    const reset = ext.getExtension('nightnutsky.bdfd-bds')?.packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;

    // Reset
    work.getConfiguration('editor').update('tokenColorCustomizations', {
        textMateRules: reset.textMateRules
    }, target);
}

// Context Menu Utils
function contextMenuUtils(context: vscode.ExtensionContext) {
    // Escape Util Listener
    win.onDidChangeTextEditorSelection(listener);
    function listener() {
        let selection = win.activeTextEditor?.selection;
        return <vscode.Selection>selection;
    };

    // Escape Util
    const escapeUtil = cmds.registerCommand('bdfd.utils.escape', escape);
    function escape() {
        win.activeTextEditor?.edit((edit: vscode.TextEditorEdit) => {
            const content = win.activeTextEditor?.document.getText(listener());
            const replaced = content?.replaceAll('\\', '\\\\').replaceAll(']', '\\]').replaceAll('$', '%{DOL}%').replaceAll(';', '\\;') as string;
            edit.replace(listener(), replaced);
        });
    };

    context.subscriptions.push(escapeUtil);
}

function loadExperiments() {
    // Auto Completions
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
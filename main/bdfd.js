const vscode = require("vscode");
const nfetch = require("node-fetch");

// Localization
const l = require('../l10n/locale');

// Shortcuts
const cmds = vscode.commands;
const win = vscode.window;
const info = win.showInformationMessage;
const error = win.showErrorMessage;
const ext = vscode.extensions;
const work = vscode.workspace;

exports.activate = activate;

function activate(context) {
    bdfdFuncList(context);
    tokenColors(context); 
    statusBar(context); 
    snippets(context)
}

var array = [];

// BDFD Function List
async function bdfdFuncList(context) {
    try {
        // ! API Request (Function Tag List)
        const list = await nfetch('https://botdesignerdiscord.com/public/api/function_tag_list');
        array = await list.json();
    
        // Debug
        console.debug('BDFD Function List Debug:\n', array);
    
        // ! Register
        const disposable = cmds.registerCommand('bdfd.funclist', quickPickList);
        context.subscriptions.push(disposable);

        // Final Info
        info(l.load_funcList_s);
    } catch(e) {
        error(`${l.load_funcList_f}: ${e}`);
    }
}

// Quick Pick For BDFD Function List
async function quickPickList() {
    // ! Quick Pick
    const bdfdFunc = await win.showQuickPick(array, { matchOnDetail: true, placeHolder: "Select function" });

    // ! API Request (Function Info)
    if (bdfdFunc == null) { return };
    const functionInfo = await nfetch(`https://botdesignerdiscord.com/public/api/function/${bdfdFunc}`);
    const data = await functionInfo.json();
    const message = `${data.tag} > ${data.shortDescription} | ${l.qp_funcList_intents}: ${data.intents}, ${l.qp_funcList_premium}: ${data.premium}`;

    // ! Show Function Info & Open wiki action
    const selection = await win.showInformationMessage(message, { title: l.qp_funcList_openWiki });
    if (selection !== undefined && selection.title == l.qp_funcList_openWiki) {
        // ! Removal of $ and [] from function tag
        const str = bdfdFunc;
        let end = str.length;
        if (str[end - 1] == ']') { end -= 2; };
        const name = str.substring(1, end);

        const wikiLink = `https://nilpointer-software.github.io/bdfd-wiki/nightly/bdscript/${name}.html`;
        cmds.executeCommand('simpleBrowser.show', wikiLink);
    };
}

// Color Customization
async function tokenColors(context) {
    // ! Register
    const disposableResetColors = cmds.registerCommand('bdfd.resettokencolors', resetColors);
    const disposableSetColors = cmds.registerCommand('bdfd.tokencolors', quickPickColors);
    context.subscriptions.push(disposableSetColors, disposableResetColors);
}

// Quick Pick For Color Customization
async function quickPickColors() {
    // ! Map
    const jsonArray = ext.getExtension('nightnutsky.bdfd-bds').packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;
    const textMateRulesMap = jsonArray.map((jsonArray) => ({
        description: `${l.qp_colors_foregroundColor}: ${jsonArray.settings.foreground} | ${l.qp_colors_fontStyle}: ${jsonArray.settings.fontStyle}`,
        colorForeground: jsonArray.settings.foreground,
        colorFontStyle: jsonArray.settings.fontStyle,
        target: vscode.ConfigurationTarget.Global,
        scope: jsonArray.scope,
        label: jsonArray.name
    }));

    // ! Quick Pick
    const color = await win.showQuickPick(textMateRulesMap, { matchOnDetail: true });

    // ! Modifying Color
    if (color == null) { return };
    const modifyWhat = await win.showQuickPick([{ label: l.qp_colors_foreground, description: l.qp_colors_foregroundChange }, { label: l.qp_colors_font, description: l.qp_colors_fontChange }]);
    if (modifyWhat == null) { return };

    const tokens = vscode.workspace.getConfiguration('editor.tokenColorCustomizations', color.target);
    var modified = undefined;

    switch (modifyWhat.label) {
        case l.qp_colors_foreground:
            // ! Input Box
            const inputBoxForeground = await win.showInputBox({ title: l.qp_colors_foregroundChanging, value: color.colorForeground, placeHolder: `${l.qp_colors_example}: #FFFFFF` });

            // ! Replace Color
            tokens.textMateRules.forEach(x => {
                if (x.scope == `${color.scope}`) {
                    x.settings.foreground = `${inputBoxForeground}`;
                };
            });
            modified = tokens.textMateRules;

            // ! Modify
            work.getConfiguration('editor', color.target).update('tokenColorCustomizations', {
                textMateRules: modified
            }, color.target);
            break;
        case l.qp_colors_font:
            // ! Input Box
            const inputBoxFontStyle = await win.showInputBox({ title: l.qp_colors_fontChanging, value: color.colorFontStyle, placeHolder: `${l.qp_colors_example}: bold italic underline` });

            // ! Replace Color
            tokens.textMateRules.forEach(x => {
                if (x.scope == `${color.scope}`) {
                    x.settings.fontStyle = `${inputBoxFontStyle}`;
                };
            });
            modified = tokens.textMateRules;

            // ! Modify
            work.getConfiguration('editor', color.target).update('tokenColorCustomizations', {
                textMateRules: modified
            }, color.target);
            break;
    };
}

// Reset Colors To Default
function resetColors() {
    const reset = ext.getExtension('nightnutsky.bdfd-bds').packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;

    // ! Reset
    work.getConfiguration('editor', vscode.ConfigurationTarget.Global).update('tokenColorCustomizations', {
        textMateRules: reset.textMateRules
    }, vscode.ConfigurationTarget.Global);
}

// Snippets (Completion Items)
function snippets(context) {
    const snippets = require('../snippets/snippets')(vscode);
    context.subscriptions.push(snippets);
}

// Status Bar
function statusBar(context) {
    const version = vscode.extensions.getExtension('nightnutsky.bdfd-bds').packageJSON.version;
    let bar = win.createStatusBarItem(vscode.StatusBarAlignment.Right);
    bar.name = 'BDFD Extension Version';
    bar.tooltip = l.bar_tooltip;
    bar.id = 'bdfdVersion';
    bar.text = version;

    if (win.activeTextEditor.document.languageId == 'bds') {
        bar.show();
    };

    const event = win.onDidChangeActiveTextEditor(() => {
        if (win.activeTextEditor.document.languageId == 'bds') {
            bar.show();
        } else {
            bar.hide();
        };
    });

    context.subscriptions.push(bar, event);
}
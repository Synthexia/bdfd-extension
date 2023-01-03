const vscode = require("vscode");
const nfetch = require("node-fetch");

const messages = {
    funcList: "The list of BDFD functions has been successfully received and loaded!",
    loadFailed: "Failed to load the BDFD Extension fully! Some features may not work. Check out the console for details."
};

const cmds = vscode.commands;
const win = vscode.window;
const ext = vscode.extensions;
const work = vscode.workspace;

exports.activate = activate;

function activate(context) {
    bdfdFuncList(context)
    tokenColors(context)
    statusBar(context)
    snippets(context)
}

var array = [];

// BDFD Function List
async function bdfdFuncList(context) {
    try {
        // ! API Request (Function Tag List)
        const list = await nfetch('https://botdesignerdiscord.com/public/api/function_tag_list');
        array = await list.json();

        // ! Information Message
        win.showInformationMessage(messages.funcList);
        console.debug('BDFD Function List Debug:\n', array);

        // ! Register
        const disposable = cmds.registerCommand('bdfd.funclist', quickPickList);
        context.subscriptions.push(disposable);
    } catch(e) {
        win.showErrorMessage(messages.loadFailed);
        console.error(e);
    }
}

// Quick Pick For BDFD Function List
async function quickPickList() {
    // ! Quick Pick
    const bdfdFunc = await win.showQuickPick(array, { matchOnDetail: true , placeHolder: "Select function"});

    // ! API Request (Function Info)
    if (bdfdFunc == null) { return };
    const functionInfo = await nfetch(`https://botdesignerdiscord.com/public/api/function/${bdfdFunc}`);
    const data = await functionInfo.json();
    const message = `${data.tag} > ${data.shortDescription} | Intents: ${data.intents}, Premium: ${data.premium}`;

    // ! Show Function Info & Open wiki action
    const selection = await win.showInformationMessage(message, { title: "Open wiki" });
    if (selection !== undefined && selection.title == "Open wiki") {
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
    const disposableSetColors = cmds.registerCommand('bdfd.tokencolors', quickPickColors);
    const disposableResetColors = cmds.registerCommand('bdfd.resettokencolors', resetColors);
    context.subscriptions.push(disposableSetColors, disposableResetColors);
}

// Quick Pick For Color Customization
async function quickPickColors() {
    // ! Map
    const jsonArray = ext.getExtension('nightnutsky.bdfd-bds').packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;
    const textMateRulesMap = jsonArray.map((jsonArray) => ({
        label: jsonArray.name,
        description: `Foreground Color: ${jsonArray.settings.foreground} | Font Style: ${jsonArray.settings.fontStyle}`,
        target: vscode.ConfigurationTarget.Global,
        scope: jsonArray.scope,
        colorForeground: jsonArray.settings.foreground,
        colorFontStyle: jsonArray.settings.fontStyle
    }));

    // ! Quick Pick
    const color = await win.showQuickPick(textMateRulesMap, {matchOnDetail: true});

    // ! Modifying Color
    if (color == null) { return };
    const modifyWhat = await win.showQuickPick([{ label: 'Foreground', description: "Modify the function's foreground color" },{ label: 'Font', description: "Modify the functions's font style" }]);
    if (modifyWhat == null) { return };
    
    const tokens = vscode.workspace.getConfiguration('editor.tokenColorCustomizations', color.target);
    var modified = undefined;

    switch (modifyWhat.label) {
        case 'Foreground':
            // ! Input Box
            const inputBoxForeground = await win.showInputBox({ title: 'Customizing Foreground Color', value: color.colorForeground, placeHolder: 'Example: #FFFFFF' });

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
        case 'Font':
            // ! Input Box
            const inputBoxFontStyle = await win.showInputBox({ title: 'Customizing Font Style', value: color.colorFontStyle, placeHolder: 'Example: bold italic underline' });

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
async function resetColors() {
    const reset = ext.getExtension('nightnutsky.bdfd-bds').packageJSON.contributes.configurationDefaults["editor.tokenColorCustomizations"].textMateRules;

    // ! Reset
    work.getConfiguration('editor', vscode.ConfigurationTarget.Global).update('tokenColorCustomizations', {
        textMateRules: reset.textMateRules
    }, vscode.ConfigurationTarget.Global);
}

// Snippets (Completion Items)
async function snippets(context) {
    const snippets = require('../snippets/snippets')(vscode);
    context.subscriptions.push(snippets);
}

// Status Bar
function statusBar(context) {
    let bar = win.createStatusBarItem(vscode.StatusBarAlignment.Right);
    bar.id = 'bdfdVersion';
    bar.name = 'BDFD Extension Version';
    bar.tooltip = 'BDFD Extension Version';
    const version = vscode.extensions.getExtension('nightnutsky.bdfd-bds').packageJSON.version;
    bar.text = version;

    bar.show();

    context.subscriptions.push(bar);
}
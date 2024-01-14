import { type ExtensionContext, commands, window } from "vscode";

import { SPECIAL_CHARACTER } from "@general/consts";

import { COMMAND, } from "./consts";

export function loadContextMenuUtils(subscriptions: ExtensionContext['subscriptions']) {
    subscriptions.push(
        commands.registerCommand(COMMAND.ESCAPE, escapeSelectedCode)
    );
}

function escapeSelectedCode() {
    const activeTextEditor = window.activeTextEditor!;
    
    activeTextEditor.edit((editor) => {
        const selection = activeTextEditor.selection;
        const selectedContent = activeTextEditor.document.getText(selection);
        const replacedContent = selectedContent
            .replaceAll(SPECIAL_CHARACTER.BACK_SLASH.NORMAL, SPECIAL_CHARACTER.BACK_SLASH.ESCAPED)
            .replaceAll(SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL, SPECIAL_CHARACTER.RIGHT_BRACKET.ESCAPED)
            .replaceAll(SPECIAL_CHARACTER.DOLLAR.NORMAL, SPECIAL_CHARACTER.DOLLAR.ESCAPED)
            .replaceAll(SPECIAL_CHARACTER.SEMICOLON.NORMAL, SPECIAL_CHARACTER.SEMICOLON.ESCAPED);

        editor.replace(selection, replacedContent);
    });
}

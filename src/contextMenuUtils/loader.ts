import {
    commands,
    window
} from "vscode";
import {
    COMMAND,
} from "./consts";
import { SPECIAL_CHARACTER } from "../generalConsts";

export default function loadContextMenuUtils() {
    commands.registerCommand(COMMAND.ESCAPE, escapeSelectedCode);
}

function escapeSelectedCode() {
    const activeTextEditor = window.activeTextEditor!;
    
    activeTextEditor.edit(editor => {
        const
            selection = activeTextEditor.selection,
            selectedContent = activeTextEditor.document.getText(selection),
            replacedContent = selectedContent
                .replaceAll(SPECIAL_CHARACTER.BACK_SLASH.NORMAL, SPECIAL_CHARACTER.BACK_SLASH.ESCAPED)
                .replaceAll(SPECIAL_CHARACTER.RIGHT_BRACKET.NORMAL, SPECIAL_CHARACTER.RIGHT_BRACKET.ESCAPED)
                .replaceAll(SPECIAL_CHARACTER.DOLLAR.NORMAL, SPECIAL_CHARACTER.DOLLAR.ESCAPED)
                .replaceAll(SPECIAL_CHARACTER.SEMICOLON.NORMAL, SPECIAL_CHARACTER.SEMICOLON.ESCAPED)
        ;

        editor.replace(selection, replacedContent)
    });
}

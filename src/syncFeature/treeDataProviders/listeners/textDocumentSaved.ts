import { type TextDocument } from "vscode";

import { Command } from "@synthexia/bdfd-external";

import { LANG, EMPTY } from "@general/consts";

import { LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { updateCurrentSyncedCommandState } from "@statusItems/stateUpdaters";

export async function textDocumentSaved(document: TextDocument, local: LocalData) {
    if (document.languageId != LANG) return;
    
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);
    const splittedFileName = document.fileName.split('\\');

    const botId = splittedFileName[splittedFileName.length - 2];
    const commandId = splittedFileName
        .pop()!
        .replace(`.${LANG}`, EMPTY);
    const code = document.getText();

    updateCurrentSyncedCommandState(true);
    await Command.update(authToken, botId, commandId, { code });
    updateCurrentSyncedCommandState(false);

}

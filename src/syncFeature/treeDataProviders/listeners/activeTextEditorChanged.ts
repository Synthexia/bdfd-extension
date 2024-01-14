import { type TextEditor, type StatusBarItem } from "vscode";
import { Command, Bot } from "@synthexia/bdfd-external";

import { rpc } from "@extension";

import { LANG, EMPTY } from "@general/consts";

import { type LocalData } from "@localDataManager";
import { UserEntry, SyncEntry } from "@localDataManager/enums";

import { updateCurrentSyncedCommandSBIData } from "@utils";

export async function activeTextEditorChangedListener(
    editor: TextEditor | undefined,
    local: LocalData,
    currentSyncedCommandSBI: StatusBarItem
) {
    if (!editor || editor.document.languageId != LANG) {
        await rpc.clearActivity();
        return currentSyncedCommandSBI.hide();
    }

    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);
    const splittedFileName = editor.document.fileName.split('\\');
    const botId = splittedFileName[splittedFileName.length - 2];
    const commandId = splittedFileName
        .pop()!
        .replace(`.${LANG}`, EMPTY);

    const { name, trigger, language } = await Command.get(authToken, botId, commandId);
    
    await local.writeSyncData({ entry: SyncEntry.Bot, data: botId });
    await local.writeSyncData({
        entry: SyncEntry.CommandData,
        data: {
            commandID: commandId,
            commandName: name,
            commandTrigger: trigger,
            commandLanguage: language
        }
    });

    const bot = await Bot.get(authToken, botId);
    const botName = bot?.name ?? 'Unknown';

    await rpc.updateActivity({
        botName,
        commandName: name,
        commandTrigger: trigger,
    });

    updateCurrentSyncedCommandSBIData(currentSyncedCommandSBI, {
        id: commandId,
        language: language.name,
        name,
        trigger
    });
    currentSyncedCommandSBI.show();
}

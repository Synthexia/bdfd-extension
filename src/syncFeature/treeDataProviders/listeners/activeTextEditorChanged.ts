import { type TextEditor, type StatusBarItem } from "vscode";
import { Command, Bot } from "@synthexia/bdfd-external";
import { rpc } from "../../../extension";
import { LANG, EMPTY } from "../../../generalConsts";
import LocalData from "../../localDataManager";
import { updateCurrentSyncedCommandSBIData } from "../../../utils";
import { UserEntry, SyncEntry } from "../../localDataManager/enums";

export async function activeTextEditorChangedListener(
    editor: TextEditor | undefined,
    local: LocalData,
    currentSyncedCommandSBI: StatusBarItem
) {
    if (!editor)
        return currentSyncedCommandSBI.hide();

    if (editor.document.languageId != LANG)
        return currentSyncedCommandSBI.hide();

    const authToken = await local.getUserData(UserEntry.AuthToken);
    const splittedFileName = editor.document.fileName.split('\\');
    const botId = splittedFileName[splittedFileName.length - 2];
    const commandId = splittedFileName
        .pop()!
        .replace(`.${LANG}`, EMPTY);

    const { name, trigger, language } = await Command.get(authToken, botId, commandId);
    
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

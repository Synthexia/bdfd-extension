import { Command, Bot } from "@synthexia/bdfd-external";
import {
    type TreeViewSelectionChangeEvent,
    type StatusBarItem,
    Uri,
    commands
} from "vscode";

import { rpc } from "@extension";

import { type LocalData } from "@localDataManager";
import { WorkspaceEntry, SyncEntry } from "@localDataManager/enums";

import { updateCurrentSyncedCommandSBIData } from "@utils";

import { type CommandItem } from "@treeDataProviders/providers/commandList";

export async function commandSelectedListener(
    selectedCommand: TreeViewSelectionChangeEvent<CommandItem>,
    local: LocalData,
    currentSyncedCommandSBI: StatusBarItem,
    authToken: string,
    botId: string
) {
    const selection = selectedCommand.selection[0];
    if (!selection) return;

    const {
        id: commandId,
        name: commandName,
        trigger: commandTrigger,
    } = selection.commandData;
    const { code, language } = await Command.get(authToken, botId, commandId);

    let commandRecord: Uri | string | undefined = await local.getWorkspaceData({
        entry: WorkspaceEntry.CommandPath,
        botID: botId,
        commandID: commandId
    });

    if (!commandRecord)
        commandRecord = await local.writeWorkspaceData({
            entry: WorkspaceEntry.BotCommands,
            botID: botId,
            commandID: commandId,
            commandCode: code
        });
    else
        commandRecord = Uri.file(commandRecord);

    await commands.executeCommand<void>('vscode.open', commandRecord);
    await local.writeSyncData({
        entry: SyncEntry.CommandData,
        data: {
            commandID: commandId,
            commandName,
            commandTrigger,
            commandLanguage: language
        }
    });

    const bot = await Bot.get(authToken, botId);
    const botName = bot?.name ?? 'Unknown';

    await rpc.updateActivity({
        botName,
        commandName,
        commandTrigger
    });

    updateCurrentSyncedCommandSBIData(currentSyncedCommandSBI, {
        id: commandId,
        name: commandName,
        trigger: commandTrigger,
        language: language.name
    });
    currentSyncedCommandSBI.show();
}

import {
    type TreeViewSelectionChangeEvent,
    type StatusBarItem,
    type ExtensionContext,
    window
} from "vscode";
import { Command, Variable } from "@synthexia/bdfd-external";
import { access, mkdir } from "fs/promises";
import { TreeView } from "../../../generalEnums";
import { actionCancelledNotification } from "../../../utils";
import LocalData from "../../localDataManager";
import { commandSelected } from "./commandSelected";
import { variableSelected } from "./variableSelected";
import * as localization from "../../../localization";
import { BotItem } from "../providers/botList";
import { CommandItem, CommandList } from "../providers/commandList";
import { VariableItem, VariableList } from "../providers/variableList";
import { WorkspaceEntry } from "../../localDataManager/enums";

const { showOpenDialog, registerTreeDataProvider, createTreeView } = window;

export async function botSelected(
    selectedBot: TreeViewSelectionChangeEvent<BotItem>,
    local: LocalData,
    currentSyncedCommandSBI: StatusBarItem,
    authToken: string,
    subscriptions: ExtensionContext['subscriptions']
) {
    const selection = selectedBot.selection[0];
    if (!selection) return;

    const { id: botId } = selection.botData;

    let folderWithBots = await local.getWorkspaceData({ entry: WorkspaceEntry.Root });

    if (!folderWithBots) {
        const selectedFolder = await showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: localization.syncFeature.treeViews.openDialog.label,
            title: localization.syncFeature.treeViews.openDialog.title
        });

        if (!selectedFolder)
            return actionCancelledNotification();

        folderWithBots = selectedFolder[0].fsPath;
        
        await local.writeWorkspaceData({ entry: WorkspaceEntry.Root, path: folderWithBots });
    }

    await access(`${folderWithBots}/${botId}`).catch(async () => await mkdir(`${folderWithBots}/${botId}`));

    const commandList: CommandItem[] = [];
    const variableList: VariableItem[] = [];

    for (const command of await Command.list(authToken, botId))
        commandList.push(new CommandItem(command));
    for (const variable of await Variable.list(authToken, botId))
        variableList.push(new VariableItem(variable));

    const commandListProvider = new CommandList(commandList);
    const variableListProvider = new VariableList(variableList);

    subscriptions.push(
        registerTreeDataProvider(TreeView.CommandList, commandListProvider),
        registerTreeDataProvider(TreeView.VariableList, variableListProvider)
    );

    const treeWithCommandList = createTreeView(TreeView.CommandList, { treeDataProvider: commandListProvider })
        .onDidChangeSelection(async (selectedCommand) => {
            await commandSelected(selectedCommand, local, currentSyncedCommandSBI, authToken, botId);
        });

    const treeWithVariableList = createTreeView(TreeView.VariableList, { treeDataProvider: variableListProvider })
        .onDidChangeSelection(async (selectedVariable) => {
            await variableSelected(selectedVariable, authToken, botId);
        });

    subscriptions.push(treeWithCommandList, treeWithVariableList);
}

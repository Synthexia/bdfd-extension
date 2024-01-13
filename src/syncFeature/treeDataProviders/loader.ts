import {
    type ExtensionContext,
    type StatusBarItem,
    window,
    workspace,
    commands,
} from "vscode";

import { statusItems } from "@extension";
import { LocalData } from "@localDataManager";
import { COMMAND } from "@syncFeature/consts";
import { StatusItem } from "@statusItems/enums";

import { TreeView } from "./enums";
import { textDocumentSavedListener } from "./listeners/textDocumentSaved";
import { activeTextEditorChangedListener } from "./listeners/activeTextEditorChanged";
import { botSelectedListener } from "./listeners/botSelected";

import { editCommandDataCallback } from "./callbacks/editCommandData";
import { deleteCommandCallback } from "./callbacks/deleteCommand";
import { deleteVariableCallback } from "./callbacks/deleteVariable";

import { BotItem, BotList } from "./providers/botList";
import { type CommandItem } from "./providers/commandList";
import { type VariableItem } from "./providers/variableList";

const { registerCommand } = commands;
const { onDidSaveTextDocument } = workspace;
const { registerTreeDataProvider, createTreeView, onDidChangeActiveTextEditor } = window;

export async function loadTreeDataProviders(context: ExtensionContext, authToken: string, botList: BotItem[]) {
    const { subscriptions } = context;

    const local = await new LocalData().init();

    const botListProvider = new BotList(botList);
    
    const currentSyncedCommandSBI = <StatusBarItem> statusItems[StatusItem.CurrentSyncedCommand];
    
    subscriptions.push(
        registerTreeDataProvider(TreeView.BotList, botListProvider),
        onDidSaveTextDocument(async (document) => await textDocumentSavedListener(document, local)),
        onDidChangeActiveTextEditor(async (editor) => await activeTextEditorChangedListener(editor, local, currentSyncedCommandSBI)),
        registerCommand(COMMAND.DELETE_COMMAND, async (args: CommandItem) => await deleteCommandCallback(local, args)),
        registerCommand(COMMAND.DELETE_VARIABLE, async (args: VariableItem) => await deleteVariableCallback(local, args)),
        registerCommand(COMMAND.EDIT_COMMAND_DATA, async () => await editCommandDataCallback(local))
    );

    const treeWithBotList = createTreeView(TreeView.BotList, { treeDataProvider: botListProvider })
        .onDidChangeSelection(async (selectedBot) => {
            await botSelectedListener(selectedBot, local, currentSyncedCommandSBI, authToken, subscriptions);
        });

    subscriptions.push(treeWithBotList);
}

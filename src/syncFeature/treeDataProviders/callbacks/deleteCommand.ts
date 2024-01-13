import { window } from "vscode";

import { Command } from "@synthexia/bdfd-external";

import { actionCancelledNotification } from "@utils";

import { type LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { type CommandItem } from "@treeDataProviders/providers/commandList";

const {
    showInformationMessage,
    showWarningMessage
} = window;

export async function deleteCommandCallback(local: LocalData, args: CommandItem) {
    const choice = await showWarningMessage('Are you sure you want to delete this command?', 'Yes') == 'Yes';
    
    if (!choice)
        return actionCancelledNotification();

    const { id, botReference} = args.commandData;
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);

    await Command.delete(authToken, botReference, id);
    showInformationMessage('The command was successfully deleted!');
}

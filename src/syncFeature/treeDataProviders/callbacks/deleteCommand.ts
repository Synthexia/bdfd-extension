import { window } from "vscode";

import { BDFDExternalRequestError, Command } from "@synthexia/bdfd-external";

import { actionCancelledNotification } from "@utils";

import { type LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { type CommandItem } from "@treeDataProviders/providers/commandList";

const {
    showInformationMessage,
    showWarningMessage,
    showErrorMessage
} = window;

export async function deleteCommandCallback(local: LocalData, args: CommandItem) {
    const choice = await showWarningMessage('Are you sure you want to delete this command?', 'Yes') == 'Yes';
    
    if (!choice)
        return actionCancelledNotification();

    const { id, botReference} = args.commandData;
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);

    const _command = await Command.delete(authToken, botReference, id).catch((r: BDFDExternalRequestError) => r.message);
    if (typeof _command == 'string') {
        showErrorMessage("The command can't be deleted because it doesn't exist in the real space");
        return;
    }

    showInformationMessage('The command was successfully deleted!');
}

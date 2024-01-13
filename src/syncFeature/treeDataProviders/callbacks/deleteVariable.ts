import { window } from "vscode";

import { Variable } from "@synthexia/bdfd-external";

import { actionCancelledNotification } from "@utils";

import { type LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { type VariableItem } from "@treeDataProviders/providers/variableList";

const {
    showInformationMessage,
    showWarningMessage
} = window;

export async function deleteVariableCallback(local: LocalData, args: VariableItem) {
    const choice = await showWarningMessage('Are you sure you want to delete this variable?', 'Yes') == 'Yes';

    if (!choice)
        return actionCancelledNotification();

    const { id, botReference } = args.variableData;
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);

    await Variable.delete(authToken, botReference, id);
    showInformationMessage('The variable was successfully deleted!');
}

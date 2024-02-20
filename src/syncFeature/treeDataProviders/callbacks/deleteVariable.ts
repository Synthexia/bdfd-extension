import { window } from "vscode";

import { BDFDExternalRequestError, Variable } from "@synthexia/bdfd-external";

import { actionCancelledNotification } from "@utils";

import { type LocalData } from "@localDataManager";
import { UserEntry } from "@localDataManager/enums";

import { type VariableItem } from "@treeDataProviders/providers/variableList";

const {
    showInformationMessage,
    showWarningMessage,
    showErrorMessage
} = window;

export async function deleteVariableCallback(local: LocalData, args: VariableItem) {
    const choice = await showWarningMessage('Are you sure you want to delete this variable?', 'Yes') == 'Yes';

    if (!choice)
        return actionCancelledNotification();

    const { id, botReference } = args.variableData;
    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);

    const _variable = await Variable.delete(authToken, botReference, id).catch((r: BDFDExternalRequestError) => r.message);
    if (typeof _variable == 'string') {
        showErrorMessage("The variable can't be deleted because it doesn't exist in the real space");
        return;
    }

    showInformationMessage('The variable was successfully deleted!');
}

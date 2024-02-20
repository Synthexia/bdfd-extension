import { type TreeViewSelectionChangeEvent, window } from "vscode";

import { BDFDExternalRequestError, Variable } from "@synthexia/bdfd-external";

import { actionCancelledNotification } from "@utils";
import * as localization from "@localization";

import { ICON } from "@treeDataProviders/consts";
import { type VariableItem } from "@treeDataProviders/providers/variableList";

const { showQuickPick, showInputBox, showErrorMessage } = window;

const {
    showQuickPick: showQuickPickLoc,
    showInputBox: showInputBoxLoc
} = localization.syncFeature.treeViews;

export async function variableSelectedListener(
    selectedVariable: TreeViewSelectionChangeEvent<VariableItem>,
    authToken: string,
    botId: string
) {
    const selection = selectedVariable.selection[0];
    if (!selection) return;

    const {
        id: variableId,
        name: variableName,
        value: variableValue
    } = selection.variableData;
    
    const action = await showQuickPick(showQuickPickLoc.variables.actions, {
        title: showQuickPickLoc.title.general,
        canPickMany: false
    });

    if (!action)
        return actionCancelledNotification();

    switch (action) {
        case showQuickPickLoc.variables.actions[0]: // Edit Variable Name
            const newVariableName = await showInputBox({
                title: showInputBoxLoc.variables.title.editingVariableName,
                value: variableName
            });

            if (!newVariableName)
                return actionCancelledNotification();

            selection.iconPath = ICON.SYNC;
            
            const _variable = await Variable.update(authToken, botId, variableId, { name: newVariableName }).catch((r: BDFDExternalRequestError) => r.message);
            if (typeof _variable == 'string') {
                showErrorMessage("The variable can't be edited because it doesn't exist in the real space");
                return;
            }
            
            selection.label = variableName;
            break;
        case showQuickPickLoc.variables.actions[1]: // Edit Variable Value
            const newVariableValue = await showInputBox({
                title: showInputBoxLoc.variables.title.editingVariableValue,
                value: variableValue
            });
            
            if (!newVariableValue)
                return actionCancelledNotification();
            
            selection.iconPath = ICON.SYNC;

            const __variable = await Variable.update(authToken, botId, variableId, { value: newVariableValue }).catch((r: BDFDExternalRequestError) => r.message);
            if (typeof __variable == 'string') {
                showErrorMessage("The variable can't be edited because it doesn't exist in the real space");
                return;
            }

            selection.tooltip = variableValue;
            break;
    }

    selection.iconPath = ICON.DATABASE;
}

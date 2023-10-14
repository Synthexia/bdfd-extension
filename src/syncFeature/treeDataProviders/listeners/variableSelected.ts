import { type TreeViewSelectionChangeEvent, window } from "vscode";
import { Variable } from "@synthexia/bdfd-external";
import { ICON } from "../consts";
import { actionCancelledNotification } from "../../../utils";
import * as localization from "../../../localization";
import { VariableItem } from "../providers/variableList";

const { showQuickPick, showInputBox } = window;

const {
    showQuickPick: showQuickPickLoc,
    showInputBox: showInputBoxLoc
} = localization.syncFeature.treeViews;

export async function variableSelected(
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
            await Variable.update(authToken, botId, variableId, { name: newVariableName });
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
            await Variable.update(authToken, botId, variableId, { value: newVariableValue });
            selection.tooltip = variableValue;
            break;
    }

    selection.iconPath = ICON.DATABASE;
}

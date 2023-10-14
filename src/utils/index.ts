import { StatusBarItem, window } from "vscode";
import * as localization from "../localization";
import { LanguageName } from "@synthexia/bdfd-external/dist/enums";

export function actionCancelledNotification() {
    window.showWarningMessage(localization.general.actionCancelled);
    return;
}

export function updateCurrentSyncedCommandSBIData(
    item: StatusBarItem,
    command: {
        name: string,
        trigger: string,
        language: LanguageName,
        id: string
    }
) {
    item.text = `$(check) ${command.name || 'Unnamed command'} - ${command.trigger || 'Non-triggerable'}`;
    item.tooltip = `${command.language} | ${command.id}`;
}

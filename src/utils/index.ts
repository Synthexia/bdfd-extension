import { StatusBarItem, window } from "vscode";

import { LanguageName } from "@synthexia/bdfd-external";

import { AUTH_TOKEN_SESSION_PART } from "@syncFeature/consts";

import {
    general as generalLoc,
    statusItems as statusItemsLoc
} from "@localization";

const { currentSyncedCommand: currentSyncedCommandLoc } = statusItemsLoc;

export function actionCancelledNotification() {
    window.showWarningMessage(generalLoc.actionCancelled);
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
    item.text = `$(check) ${command.name || currentSyncedCommandLoc.text.unnamedCommand} - ${command.trigger || currentSyncedCommandLoc.text.nonTriggerableCommand}`;
    item.tooltip = `${command.language} | ${command.id}`;
}

export function handleAuthToken(authToken: string) {
    const authTokenParts = authToken.split('=');

    if (authTokenParts[0] == AUTH_TOKEN_SESSION_PART)
        return authToken.replace(`${AUTH_TOKEN_SESSION_PART}=`, '');
    else
        return authToken;
}

import { window } from "vscode";

import { Command } from "@synthexia/bdfd-external";
import { LanguageId, LanguageName } from "@synthexia/bdfd-external/dist/enums";

import { updateCurrentSyncedCommandState } from "@statusItems/stateUpdaters";
import { actionCancelledNotification } from "@utils";
import { syncFeature as syncFeatureLoc } from "@localization";

import { type LocalData } from "@localDataManager";
import { UserEntry, SyncEntry } from "@localDataManager/enums";

const { showQuickPick, showInputBox } = window;

const {
    showQuickPick: showQuickPickLoc,
    showInputBox: showInputBoxLoc
} = syncFeatureLoc.treeViews;

export async function editCommandDataCallback(local: LocalData) {
    const action = await showQuickPick(showQuickPickLoc.commands.actions, {
        title: showQuickPickLoc.title.general,
        canPickMany: false
    });

    if (!action)
        return actionCancelledNotification();

    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);
    const botId = await local.getSyncData(SyncEntry.Bot);
    const { commandID, commandName, commandTrigger, commandLanguage } = await local.getSyncData(SyncEntry.CommandData);

    switch (action) {
        case showQuickPickLoc.commands.actions[0]: // Edit Command Name
            const newCommandName = await showInputBox({
                title: showInputBoxLoc.commands.title.editingCommandName,
                value: commandName
            });

            if (!newCommandName)
                return actionCancelledNotification();

            updateCurrentSyncedCommandState(true);
            await local.writeSyncData({ entry: SyncEntry.CommandData, data: { commandName: newCommandName }});
            await Command.update(authToken, botId, commandID, { name: newCommandName });
            updateCurrentSyncedCommandState(false);
            break;
        case showQuickPickLoc.commands.actions[1]: // Edit Command Trigger
            const newCommandTrigger = await showInputBox({
                title: showInputBoxLoc.commands.title.editingCommandTrigger,
                value: commandTrigger
            });

            if (!newCommandTrigger)
                return actionCancelledNotification();

            updateCurrentSyncedCommandState(true);
            await local.writeSyncData({ entry: SyncEntry.CommandData, data: { commandTrigger: newCommandTrigger }});
            await Command.update(authToken, botId, commandID, { trigger: newCommandTrigger });
            updateCurrentSyncedCommandState(false);
            break;
        case showQuickPickLoc.commands.actions[2]: // Change Scripting Language
            const newCommandLanguage = <LanguageName | undefined> await showQuickPick([
                LanguageName.BDS,
                LanguageName.BDS2,
                LanguageName.BDSU,
                LanguageName.JS
            ], {
                title: showQuickPickLoc.title.changingScriptingLanguage,
                placeHolder: showQuickPickLoc.commands.placeholder(commandLanguage.name),
                canPickMany: false
            });

            if (!newCommandLanguage)
                return actionCancelledNotification();

            let languageId!: LanguageId;

            switch (newCommandLanguage) {
                case LanguageName.BDS:
                    languageId = LanguageId.BDS;
                    break;
                case LanguageName.BDS2:
                    languageId = LanguageId.BDS2;
                    break;
                case LanguageName.BDSU:
                    languageId = LanguageId.BDSU;
                    break;
                case LanguageName.JS:
                    languageId = LanguageId.JS;
                    break;
            }

            updateCurrentSyncedCommandState(true);
            await local.writeSyncData({
                entry: SyncEntry.CommandData,
                data: {
                    commandLanguage: {
                        id: languageId,
                        name: newCommandLanguage
                    }
                }
            });
            await Command.update(authToken, botId, commandID, { languageName: newCommandLanguage });
            updateCurrentSyncedCommandState(false);
            break;
    }
}

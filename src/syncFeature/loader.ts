import { window, type ExtensionContext, commands } from "vscode";

import { Bot, User } from "@synthexia/bdfd-external";

import { actionCancelledNotification, handleAuthToken } from "@utils";
import { UserEntry, WriteAccountAction } from "@localDataManager/enums";
import { syncFeature as syncFeatureLoc } from "@localization";

import { LocalData, LocalDataManager } from "@localDataManager";
import { loadTreeDataProviders } from "@treeDataProviders/loader";
import { BotItem } from "@treeDataProviders/providers/botList";

import { COMMAND } from "@syncFeature/consts";
import { switchAccountCallback } from "./callbacks/switchAccount";

const { showInformationMessage, showInputBox } = window;
const { registerCommand } = commands;

export async function loadSyncFeature(subscriptions: ExtensionContext['subscriptions']) {
    const local = await new LocalData().init();
    
    subscriptions.push(
        registerCommand(COMMAND.SWITCH_ACCOUNT, async () => await switchAccountCallback(local))
    );

    const { authToken } = await local.getUserData(UserEntry.CurrentAccount);

    await authorize(subscriptions, local, authToken);
}

async function authorize(subscriptions: ExtensionContext['subscriptions'], local: LocalData, authToken: string, failed = false) {
    const username = await User.get(authToken)
        .catch(async () => {
            const action = await showInformationMessage(syncFeatureLoc.greeting.featureUnauthorized, syncFeatureLoc.greeting.authorizeAction);
            
            if (action == syncFeatureLoc.greeting.authorizeAction) {
                const inputtedAuthToken = await showInputBox({
                    title: syncFeatureLoc.command.configureSyncFeature.titles.title,
                    placeHolder: syncFeatureLoc.command.configureSyncFeature.placeholders.placeholder,
                    password: true
                });

                if (!inputtedAuthToken)
                    return actionCancelledNotification();

                const handledAuthToken = handleAuthToken(inputtedAuthToken);

                await local.writeUserData({
                    entry: UserEntry.CurrentAccount,
                    data: {
                        username: '',
                        authToken: handledAuthToken
                    }
                });

                await authorize(subscriptions, local, handledAuthToken, true);
            }
        });

    if (!username) return;
    
    if (failed) {
        const data: LocalDataManager.Data.User.Account = { username, authToken };

        await local.writeUserData({
            entry: UserEntry.CurrentAccount,
            data
        });

        await local.writeUserData({
            entry: UserEntry.Accounts,
            action: WriteAccountAction.Add,
            data
        });
    }

    showInformationMessage(syncFeatureLoc.greeting.featureAuthorized(username));

    const botItems: BotItem[] = [];
    for (const bot of await Bot.list(authToken))
        botItems.push(new BotItem(bot));

    await loadTreeDataProviders(subscriptions, authToken, botItems);
}

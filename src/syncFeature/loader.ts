import { window, type ExtensionContext } from "vscode";

import { AUTH_TOKEN_SESSION_PART } from "./consts";

import LocalData from "./localDataManager";
import * as localization from "../localization";
import { loadTreeDataProviders } from "./treeDataProviders/loader";
import { Bot, User } from "@synthexia/bdfd-external";
import { actionCancelledNotification } from "../utils";
import { UserEntry } from "./localDataManager/enums";
import { BotItem } from "./treeDataProviders/providers/botList";

const { showInformationMessage, showInputBox } = window;

function handleAuthToken(authToken: string) {
    const authTokenParts = authToken.split('=');

    if (authTokenParts[0] == AUTH_TOKEN_SESSION_PART) return authToken.replace(`${AUTH_TOKEN_SESSION_PART}=`, '');
    else return authToken;
}

export default async function loadSyncFeature(context: ExtensionContext) {
    const local = await new LocalData().init();
    
    const authToken = await local.getUserData(UserEntry.AuthToken);

    const username = await User.get(authToken)
        .catch(() => {
            showInformationMessage(localization.syncFeature.greeting.featureUnauthorized, localization.syncFeature.greeting.authorizeAction)
                .then(async (item) => {
                    if (item == localization.syncFeature.greeting.authorizeAction) {
                        const input = await showInputBox({
                            title: localization.syncFeature.command.configureSyncFeature.titles.title,
                            placeHolder: localization.syncFeature.command.configureSyncFeature.placeholders.token,
                            password: true
                        });

                        if (!input)
                            return actionCancelledNotification();

                        await local.writeUserData({
                            entry: UserEntry.AuthToken,
                            data: handleAuthToken(input)
                        });

                        loadSyncFeature(context);
                    }
                });

            return;
        });

    if (!username) return;

    showInformationMessage(localization.syncFeature.greeting.featureAuthorized(username));

    const items: BotItem[] = [];
    for (const bot of await Bot.list(authToken))
        items.push(new BotItem(bot));

    await loadTreeDataProviders(context, authToken, items);
}

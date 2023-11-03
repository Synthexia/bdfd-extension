import { QuickPickItem, ThemeIcon, window } from "vscode";

import { type Data, User } from "@synthexia/bdfd-external";

import { LocalData, LocalDataManager } from "@localDataManager";
import { UserEntry, WriteAccountAction } from "@localDataManager/enums";

import { syncFeature as syncFeatureLoc } from "@localization";
import { actionCancelledNotification, handleAuthToken } from "@utils";

const {
    showInputBox: showInputBoxLoc,
    showQuickPick: showQuickPickLoc
} = syncFeatureLoc.command.switchAccount;

const {
    showInputBox,
    showQuickPick,
    showErrorMessage,
    showInformationMessage
} = window;

export async function switchAccountCallback(local: LocalData) {
    const accounts = await local.getUserData(UserEntry.Accounts);
    const accountsInQuickPick: QuickPickItem[] = [];

    const [addAccountAction, removeAccountAction] = showQuickPickLoc.actions;
    const actions: QuickPickItem[] = [];

    for (const action of showQuickPickLoc.actions)
        actions.push({
            label: action,
            iconPath:
                action == addAccountAction
                    ? new ThemeIcon('add')
                    : new ThemeIcon('remove')
        });

    if (accounts.length) {
        for (const account of accounts)
            accountsInQuickPick.push({
                label: account.username,
                iconPath: new ThemeIcon('account')
            });

        actions.unshift(...accountsInQuickPick);
    }

    const pick = await showQuickPick(actions, {
        title: showQuickPickLoc.title.general,
        canPickMany: false,
        matchOnDetail: true
    });

    if (!pick)
        return actionCancelledNotification();

    // pick.label equals to an account's username
    switch (pick.label) {
        case addAccountAction:
            const input = await showInputBox({
                title: showInputBoxLoc.title.addingAccount,
                placeHolder: showInputBoxLoc.placeholder.inputAuthToken,
                password: true
            });

            if (!input)
                return actionCancelledNotification();

            const authToken = handleAuthToken(input);
            const username = await User.get(authToken)
                .catch((e: Data.Error) => {
                    showErrorMessage(e.message);
                });

            if (!username) return;

            await local.writeUserData({
                entry: UserEntry.Accounts,
                action: WriteAccountAction.Add,
                data: { username, authToken }
            }).then(() => {
                showInformationMessage('Account successfully added!');
            }).catch((e: Error) => {
                showErrorMessage(e.message);
            });
            break;
        case removeAccountAction:
            const selectedAccounts = await showQuickPick(accountsInQuickPick, {
                title: showQuickPickLoc.title.removingAccount,
                placeHolder: showQuickPickLoc.placeholder.accountsToRemove,
                canPickMany: true
            });

            if (!selectedAccounts)
                return actionCancelledNotification();

            const deletedAccounts: LocalDataManager.Data.User.Account[] = await local.writeUserData({
                entry: UserEntry.Accounts,
                action: WriteAccountAction.Remove,
                data: selectedAccounts.map((account) => account.label)
            });

            if (deletedAccounts.length)
                showInformationMessage(`Accounts (${deletedAccounts.map((account) => account.username).join(',')}) were successfully deleted!`, 'Revert')
                    .then(async (item) => {
                        if (item == 'Revert')
                            for (const account of deletedAccounts!)
                                await local.writeUserData({
                                    entry: UserEntry.Accounts,
                                    action: WriteAccountAction.Add,
                                    data: account
                                });
                    });
            else
                showErrorMessage('Failed to remove any selected account!');
            break;
        default:
            const selectedAccount = accounts.find((account) => account.username == pick.label);

            if (!selectedAccount) {
                showErrorMessage('Failed to switch an account (it does not exist)');
                return;
            }

            await local.writeUserData({
                entry: UserEntry.CurrentAccount,
                data: selectedAccount
            });

            showInformationMessage(`Switched to ${pick.label}!`);
            break;
    }
}

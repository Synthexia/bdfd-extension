import {
    type InputBoxOptions,
    commands,
    env,
    window,
    workspace
} from "vscode";

import {
    LANG,
    SEMI_EMPTY
} from "../generalConsts";
import {
    AUTH_TOKEN_SESSION_PART,
    COMMAND,
    LANGUAGES,
    NEW_EMPTY_COMMAND
} from "./consts";

import {
    USER_ENTRIES,
    SYNC_ENTRIES,
    LANGUAGE_NAME,
    LANGUAGE_ID
} from "./localDataManager/enums";
import type { Sync } from "../../types";

import l from "../locale"; // deprecated
import SyncFeature from ".";
import LocalData from "./localDataManager";
import localization from "../localization";

const info = window.showInformationMessage;
const error = window.showErrorMessage;
const warn = window.showWarningMessage;

const inputBox = window.showInputBox;
const quickPick = window.showQuickPick;

const local = new LocalData();

const sync = async () => new SyncFeature({
    authToken: <string> await local.getUserData(USER_ENTRIES.AUTH_TOKEN),
    botID: <string> await local.getSyncData(SYNC_ENTRIES.BOT)
});

function handleAuthToken(authToken: string) {
    const authTokenParts = authToken.split('=');

    if (authTokenParts[0] == AUTH_TOKEN_SESSION_PART) {
        return authToken.replace(`${AUTH_TOKEN_SESSION_PART}=`, '');
    } else {
        return authToken;
    }
}

function showErrorMessage(message: string, errorMessage: string) {
    error(message, l.sync.general.error.selectToCopyAction).then(item => {
        if (item == l.sync.general.error.selectToCopyAction) {
            info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(errorMessage));
        }
    });
}

export default function loadSyncFeature() {
    greetingNotification();
    registerCommands();
}

function registerCommands() {
    commands.registerCommand(COMMAND.CREATE.COMMAND, createCommand);
    commands.registerCommand(COMMAND.CREATE.VARIABLE, createVariable);
    commands.registerCommand(COMMAND.DELETE.COMMAND, deleteCommand);
    commands.registerCommand(COMMAND.DELETE.VARIABLE, deleteVariable);
    commands.registerCommand(COMMAND.MODIFY.COMMAND_DATA, modifyCommand);
    commands.registerCommand(COMMAND.OPEN.BOT_LIST, openBotList);
    commands.registerCommand(COMMAND.OPEN.COMMAND_LIST, openCommandList);
    commands.registerCommand(COMMAND.OPEN.VARIABLE_LIST, openVariableList);
    commands.registerCommand(COMMAND.PUSH.COMMAND, pushCommand);
    commands.registerCommand(COMMAND.CONFIGURE, configure);
}

function greetingNotification() {
    sync().then((feature) => {
        feature.user()
        .then((username) => {
            info(localization.syncFeature.greeting.featureAuthorized(username));
        })
        .catch(() => {
            info(localization.syncFeature.greeting.featureUnauthorized, localization.syncFeature.greeting.authorizeAction).then((item) => {
                if (item == localization.syncFeature.greeting.authorizeAction) {
                    inputBox({
                        title: localization.syncFeature.command.configureSyncFeature.titles.title,
                        placeHolder: localization.syncFeature.command.configureSyncFeature.placeholders.token,
                        password: true
                    }).then((input) => {
                        if (!input) {
                            warn(localization.general.actionCancelled);
                            return;
                        }

                        const authToken = handleAuthToken(input);

                        local.writeUserData(USER_ENTRIES.AUTH_TOKEN, authToken).then(() => {
                            greetingNotification();
                        });
                    });
                }
            });
        });
    });
}

function configure() {
    quickPick(
        [
            {
                label: l.sync.configure.labels.token,
                description: l.sync.configure.descriptions.token
            },
            {
                label: l.sync.configure.labels.bot,
                description: l.sync.configure.descriptions.bot
            }
        ],
        {
            title: l.sync.configure.titles.title,
            placeHolder: l.sync.configure.placeholders.select,
            matchOnDescription: true
        }
    ).then(async (item) => {
        if (item) {
            switch (item.label) {
                case l.sync.configure.labels.token:
                    inputBox(
                        {
                            title: l.sync.configure.titles.token,
                            placeHolder: l.sync.configure.placeholders.token,
                            password: true
                        }
                    ).then(async (input) => {
                        if (input) {
                            const authToken = handleAuthToken(input);

                            local.writeUserData(USER_ENTRIES.AUTH_TOKEN, <string> authToken).then(() => info(l.sync.configure.afterChange.message, l.sync.configure.afterChange.action).then(item => {
                                if (item == l.sync.configure.afterChange.action) {
                                    openBotList();
                                }
                            }));                            
                        } else {
                            warn(l.general.actionCancelled);
                        }
                    });
                    break;
                case l.sync.configure.labels.bot:
                    openBotList();
                    break;
            }
        } else {
            warn(l.general.actionCancelled);
        }
    });
}

function openBotList() {
    sync().then(async (feature) => {
        const list = await feature.botListQuickPick().catch((errorQuickPick) => <Sync.QuickPick.BotList[]> errorQuickPick);

        quickPick(list, {
            title: l.sync.botList.titles.title,
            placeHolder: l.sync.botList.placeholders.placeholder,
            matchOnDetail: true
        }).then((item) => {
            if (!item) {
                warn(l.general.actionCancelled);
                return;
            }

            if (item._error) {
                info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(item._error));
                return;
            }

            const botID = item._id;
            const botName = item.label;
            const commands = item._commands;
            const variables = item._variables;

            local.writeSyncData(SYNC_ENTRIES.BOT, botID).then(() => {
                info(l.sync.botList.afterSync(botName, commands, variables));
                openCommandList();
            });
        });
    });
}

function openCommandList() {
    sync().then(async (feature) => {
        const list = await feature.commandListQuickPick().catch((errorQuickPick) => <Sync.QuickPick.CVL[]> errorQuickPick);

        quickPick(list, {
            title: l.sync.commandList.titles.title,
            placeHolder: l.sync.commandList.placeholders.select,
            matchOnDetail: true
        }).then(async (item) => {
            if (!item) {
                warn(l.general.actionCancelled);
                return;
            }

            if (item._error) {
                info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(item._error));
                return;
            }

            feature.getCommand(item._id)
            .then((command) => {
                const {
                    commandName,
                    commandTrigger,
                    commandLanguage,
                    commandCode
                } = command;

                local.writeSyncData(SYNC_ENTRIES.COMMAND_DATA, {
                    commandID: item._id,
                    commandName,
                    commandTrigger,
                    // @ts-ignore
                    commandLanguage
                }).then(() => {
                    info(l.sync.commandList.afterSync.message, l.sync.commandList.afterSync.action).then((item) => {
                        if (item == l.sync.commandList.afterSync.action) {
                            workspace.openTextDocument({
                                language: LANG,
                                content: commandCode || SEMI_EMPTY
                            });
                        }
                    });
                });
            })
            .catch((e) => {
                error('An error occured while getting command data.');
                console.error('An error occured while getting command data:', e);
            });
        });
    });
}

function modifyCommand() {
    quickPick(
        [
            l.sync.modifyCommand.labels.name,
            l.sync.modifyCommand.labels.trigger,
            l.sync.modifyCommand.labels.language
        ],
        {
            title: l.sync.modifyCommand.titles.title,
            placeHolder: l.sync.modifyCommand.placeholders.select.modify
        }
    ).then((item) => {
        if (item) {
            switch (item) {
                case l.sync.modifyCommand.labels.name:
                    inputBox(
                        {
                            title: l.sync.modifyCommand.titles.name,
                            placeHolder: l.sync.modifyCommand.placeholders.type.name
                        }
                    ).then(async (input) => {
                        if (input) {
                            local.writeSyncData(SYNC_ENTRIES.COMMAND_DATA, <Sync.LocalDataManager.Command.Data> {
                                commandName: input
                            }).then(() => info(l.sync.modifyCommand.afterChange.name(input)));
                        } else {
                            warn(l.general.actionCancelled);
                        }
                    });
                    break;
                case l.sync.modifyCommand.labels.trigger:
                    inputBox(
                        {
                            title: l.sync.modifyCommand.titles.name,
                            placeHolder: l.sync.modifyCommand.placeholders.type.name
                        }
                    ).then(async (input) => {
                        if (input) {
                            local.writeSyncData(SYNC_ENTRIES.COMMAND_DATA, <Sync.LocalDataManager.Command.Data> {
                                commandTrigger: input
                            }).then(() => info(l.sync.modifyCommand.afterChange.trigger(input)));
                        } else {
                            warn(l.general.actionCancelled);
                        }
                    });
                    break;
                case l.sync.modifyCommand.labels.language:
                    quickPick(
                        LANGUAGES.NAME,
                        {
                            title: l.sync.modifyCommand.titles.language,
                            placeHolder: l.sync.modifyCommand.placeholders.select.language
                        }
                    ).then(async (item) => {
                        if (item) {
                            let languageData!: Sync.LocalDataManager.Command.LanguageData;

                            switch (item) {
                                case LANGUAGE_NAME.BDS:
                                    languageData = {
                                        name: LANGUAGE_NAME.BDS,
                                        id: LANGUAGE_ID.BDS
                                    };
                                    break;
                                case LANGUAGE_NAME.BDS2:
                                    languageData = {
                                        name: LANGUAGE_NAME.BDS2,
                                        id: LANGUAGE_ID.BDS2
                                    };
                                    break;
                                case LANGUAGE_NAME.BDSU:
                                    languageData = {
                                        name: LANGUAGE_NAME.BDSU,
                                        id: LANGUAGE_ID.BDSU
                                    };
                                    break;
                                case LANGUAGE_NAME.JS:
                                    languageData = {
                                        name: LANGUAGE_NAME.JS,
                                        id: LANGUAGE_ID.JS
                                    };
                                    break;
                            }

                            local.writeSyncData(SYNC_ENTRIES.COMMAND_DATA, <Sync.LocalDataManager.Command.Data> {
                                commandLanguage: languageData
                            }).then(() => info(l.sync.modifyCommand.afterChange.language(item)));
                        } else {
                            warn(l.general.actionCancelled);
                        }
                    });
                    break;
            }
        } else {
            warn(l.general.actionCancelled);
        }
    })
}

function pushCommand() {
    local.getSyncData(SYNC_ENTRIES.COMMAND_DATA).then(async (get) => {
        const commandData = <Sync.LocalDataManager.Command.Data> <Sync.LocalDataManager.Data.Sync.Sync> get;
        const commandCode = window.activeTextEditor!.document.getText();

        const { commandID, commandName, commandTrigger, commandLanguage } = commandData;

        sync().then((feature) => {
            feature.updateCommand({ commandName, commandTrigger, commandLanguage, commandCode }, commandID)
            .then(() => {
                // TODO: add Revert action
                info(l.sync.pushCommand.afterCreate.message);
            })
            .catch((e) => {
                showErrorMessage(l.sync.general.error.pushCommand(e.message), e.message);
            });
        });
    });
}

function createCommand() {
    const inputBoxOptions: InputBoxOptions = {
        title: l.sync.createCommand.titles.title,
        placeHolder: l.sync.createCommand.placeholders.placeholder
    };

    inputBox({
        ...inputBoxOptions,
        prompt: l.sync.createCommand.promts.name
    }).then((commandName) => {
        if (!commandName) {
            warn(l.general.actionCancelled);
            return;
        }

        inputBox({
            ...inputBoxOptions,
            prompt: l.sync.createCommand.promts.trigger
        }).then((commandTrigger) => {
            if (!commandTrigger) {
                warn(l.general.actionCancelled);
                return;
            }

            sync().then((feature) => {
                feature.createCommand({
                    commandName,
                    commandTrigger,
                    commandLanguage: {
                        id: LANGUAGE_ID.BDS2
                    },
                    commandCode: NEW_EMPTY_COMMAND,
                })
                .then(() => {
                    info(l.sync.createCommand.afterCreate.message, l.sync.createCommand.afterCreate.action).then((item) => {
                        if (item == l.sync.createCommand.afterCreate.action) {
                            openCommandList();
                        }
                    });
                })
                .catch((e) => {
                    showErrorMessage(l.sync.general.error.createCommand(e.message), e.message);
                });
            });
        });
    });
}

function createVariable() {
    const inputBoxOptions: InputBoxOptions = {
        title: l.sync.createVariable.titles.title,
        placeHolder: l.sync.createVariable.placeholders.placeholder
    };

    inputBox({
        ...inputBoxOptions,
        prompt: l.sync.createVariable.promts.name
    }).then((variableName) => {
        if (!variableName) {
            warn(l.general.actionCancelled);
            return;
        }

        inputBox({
            ...inputBoxOptions,
            prompt: l.sync.createVariable.promts.value
        }).then((variableValue) => {
            if (!variableValue) {
                warn(l.general.actionCancelled);
                return;
            }

            sync().then((feature) => {
                feature.createVariable({ variableName, variableValue })
                .then(() => {
                    info(l.sync.createVariable.afterCreate.message, l.sync.createVariable.afterCreate.action).then((item) => {
                        if (item == l.sync.createVariable.afterCreate.action) {
                            openVariableList();
                        }
                    });
                })
                .catch((e) => {
                    showErrorMessage(l.sync.general.error.createVariable(e.message), e.message);
                });
            });
        });
    });
}

function openVariableList() {
    sync().then(async (feature) => {
        const list = await feature.variableListQuickPick().catch((errorQuickPick) => <Sync.QuickPick.CVL[]> errorQuickPick);

        quickPick(list, {
            title: l.sync.variableList.titles.title,
            placeHolder: l.sync.variableList.placeholders.placeholder,
            matchOnDetail: true
        }).then((selectedVariable) => {
            if (!selectedVariable) {
                warn(l.general.actionCancelled);
                return;
            }

            if (selectedVariable._error) {
                info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(selectedVariable._error));
                return;
            }

            quickPick([
                l.sync.modifyVariable.labels.name,
                l.sync.modifyVariable.labels.value
            ], {
                title: l.sync.modifyVariable.titles.title,
                placeHolder: l.sync.modifyVariable.placeholders.placeholder
            }).then((prop) => {
                if (!prop) {
                    warn(l.general.actionCancelled);
                    return;
                }

                switch (prop) {
                    case l.sync.modifyVariable.labels.name:
                        inputBox({
                            title: l.sync.modifyVariable.titles.name,
                            prompt: l.sync.modifyVariable.promts.name,
                            value: selectedVariable.label
                        }).then((variableName) => {
                            if (!variableName) {
                                warn(l.general.actionCancelled);
                                return;
                            }

                            sync().then((feature) => {
                                feature.updateVariable({ variableName }, selectedVariable._id)
                                .then(() => {
                                    // TODO: add Revert action
                                    info(l.sync.modifyVariable.afterChange.name(variableName));
                                })
                                .catch((e) => {
                                    showErrorMessage(l.sync.general.error.updateVariable(e.message), e.message);
                                });
                            });
                        });
                        break;
                    case l.sync.modifyVariable.labels.value:
                        inputBox({
                            title: l.sync.modifyVariable.titles.value,
                            prompt: l.sync.modifyVariable.promts.value,
                            value: selectedVariable.detail
                        }).then((variableValue) => {
                            if (!variableValue) {
                                warn(l.general.actionCancelled);
                                return;
                            }

                            sync().then((feature) => {
                                feature.updateVariable({ variableValue }, selectedVariable._id)
                                .then(() => {
                                    // TODO: add Revert action
                                    info(l.sync.modifyVariable.afterChange.value(variableValue));
                                })
                                .catch((e) => {
                                    showErrorMessage(l.sync.general.error.updateVariable(e.message), e.message);
                                });
                            });
                        });
                        break;
                }
            });
        });
    });
}

function deleteCommand() {
    sync().then(async (feature) => {
        const list = await feature.commandListQuickPick().catch((errorQuickPick) => <Sync.QuickPick.CVL[]> errorQuickPick);

        quickPick(list, {
            title: l.sync.deleteCommand.titles.title,
            placeHolder: l.sync.deleteCommand.placeholders.placeholder,
            matchOnDetail: true,
            canPickMany: true
        }).then((commands) => {
            if (!commands?.length) {
                warn(l.general.actionCancelled);
                return;
            }

            if (commands[0]._error) {
                info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(commands[0]._error));
                return;
            }

            for (const command of commands) {
                feature.deleteCommand(command._id)
                .then(() => {
                    // TODO add Revert action
                    info(l.sync.deleteCommand.afterDeletion.message);
                })
                .catch((e) => {
                    showErrorMessage(l.sync.general.error.deleteCommand(e.message), e.message);
                });
            }
        });
    });
}

function deleteVariable() {
    sync().then(async (feature) => {
        const list = await feature.variableListQuickPick().catch((errorQuickPick) => <Sync.QuickPick.CVL[]> errorQuickPick);

        quickPick(list, {
            title: l.sync.deleteVariable.titles.title,
            placeHolder: l.sync.deleteVariable.placeholders.placeholder,
            matchOnDetail: true,
            canPickMany: true
        }).then((variables) => {
            if (!variables?.length) {
                warn(l.general.actionCancelled);
                return;
            }

            if (variables[0]._error) {
                info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(variables[0]._error));
                return;
            }

            for (const variable of variables) {
                feature.deleteCommand(variable._id)
                .then(() => {
                    // TODO add Revert action
                    info(l.sync.deleteVariable.afterDeletion.message);
                })
                .catch((e) => {
                    showErrorMessage(l.sync.general.error.deleteVariable(e.message), e.message);
                });
            }
        });
    });
}

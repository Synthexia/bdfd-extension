import {
    type InputBoxOptions,
    commands,
    env,
    window,
    workspace
} from "vscode";
import {
    AUTH_TOKEN_SESSION_PART,
    COMMAND,
    ENTRY,
    LANGUAGES,
    NEW_EMPTY_COMMAND
} from "./consts";
import l from "../locale";
import Sync from ".";
import type { CommandResponse, RequestError } from "@nightnutsky/bdfd-external";
import { LocalData } from "./localDataManager";
import type { CommandData, LanguageData } from "../types/syncFeature/localDataManager";
import {
    LANG,
    EMPTY,
    SEMI_EMPTY
} from "../generalConsts";

const
    info = window.showInformationMessage,
    error = window.showErrorMessage,
    warn = window.showWarningMessage
;
const
    inputBox = window.showInputBox,
    quickPick = window.showQuickPick
;

const local = new LocalData();


const sync = async () => new Sync({
    authToken: <string> await local.getUserData(ENTRY.USER.AUTH_TOKEN),
    botID: <string> await local.getSyncData(ENTRY.SYNC.BOT)
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
    info(l.sync.configure.greeting.message, l.sync.configure.greeting.action).then(item => {
        if (item == l.sync.configure.greeting.action) {
            inputBox(
                {
                    title: l.sync.configure.titles.title,
                    placeHolder: l.sync.configure.placeholders.token,
                    password: true
                }
            ).then(input => {
                if (input) {
                    const authToken = handleAuthToken(input);

                    local.writeUserData(ENTRY.USER.AUTH_TOKEN, <string> authToken).then(() => info(l.sync.configure.afterChange.message, l.sync.configure.afterChange.action).then(item => {
                        if (item == l.sync.configure.afterChange.action) {
                            openBotList();
                        }
                    }));
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        }
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

                            local.writeUserData(ENTRY.USER.AUTH_TOKEN, <string> authToken).then(() => info(l.sync.configure.afterChange.message, l.sync.configure.afterChange.action).then(item => {
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
    sync().then(sync => {
        sync.botListQuickPick().then(list => {
            quickPick(
                list,
                {
                    title: l.sync.botList.titles.title,
                    placeHolder: l.sync.botList.placeholders.placeholder,
                    matchOnDetail: true
                }
            ).then(async (item) => {
                if (item) {
                    if (item._error) {
                        info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(item._error));
                    } else {
                        const
                            botID = item._id,
                            botName = item.label,
                            commands = item._commands,
                            variables = item._variables
                        ;
        
                        local.writeSyncData(ENTRY.SYNC.BOT, <string> botID).then(() => info(l.sync.botList.afterSync(botName, commands, variables)));
                        openCommandList();
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        });
    });
}

function openCommandList() {
    sync().then(sync => {
        sync.commandListQuickPick().then(list => {
            quickPick(
                list,
                {
                    title: l.sync.commandList.titles.title,
                    placeHolder: l.sync.commandList.placeholders.select,
                    matchOnDetail: true
                }
            ).then(async (item) => {
                if (item) {
                    if (item._error) {
                        info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(item._error));
                    } else {
                        const get = await sync.getCommand(item._id);
    
                        const {
                            commandName,
                            commandTrigger,
                            commandLanguage,
                            commandLanguageID,
                            commandCode
                        } = <CommandResponse>get;
    
                        local.writeSyncData(ENTRY.SYNC.COMMAND_DATA, <CommandData> {
                            commandID: item._id,
                            commandName: commandName,
                            commandTrigger: commandTrigger,
                            commandLanguage: {
                                name: commandLanguage,
                                id: commandLanguageID
                            }
                        }).then(() => info(l.sync.commandList.afterSync.message, l.sync.commandList.afterSync.action).then(item => {
                            if (item == l.sync.commandList.afterSync.action) {
                                workspace.openTextDocument({
                                    language: LANG,
                                    content: commandCode == EMPTY ? SEMI_EMPTY : commandCode
                                });
                            }
                        }));
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
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
    ).then(item => {
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
                            local.writeSyncData(ENTRY.SYNC.COMMAND_DATA, <CommandData> {
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
                            local.writeSyncData(ENTRY.SYNC.COMMAND_DATA, <CommandData> {
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
                            let languageData!: LanguageData;

                            switch (item) {
                                case LANGUAGES.NAME[0]:
                                    languageData = {
                                        name: LANGUAGES.NAME[0],
                                        id: LANGUAGES.ID[0]
                                    };
                                    break;
                                case LANGUAGES.NAME[1]:
                                    languageData = {
                                        name: LANGUAGES.NAME[1],
                                        id: LANGUAGES.ID[1]
                                    };
                                    break;
                                case LANGUAGES.NAME[2]:
                                    languageData = {
                                        name: LANGUAGES.NAME[2],
                                        id: LANGUAGES.ID[2]
                                    };
                                    break;
                                case LANGUAGES.NAME[3]:
                                    languageData = {
                                        name: LANGUAGES.NAME[3],
                                        id: LANGUAGES.ID[3]
                                    };
                                    break;
                            }

                            local.writeSyncData(ENTRY.SYNC.COMMAND_DATA, <CommandData> {
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
    local.getSyncData(ENTRY.SYNC.COMMAND_DATA).then(async (get) => {
        const
            commandData = <CommandData> get,
            commandCode = window.activeTextEditor!.document.getText()
        ;

        const update = await sync().then(sync => sync.updateCommand({
            ...commandData,
            commandCode: commandCode
        }))

        const {
            status,
            message
        } = <RequestError> update;
        // TODO: add "Revert" action -> const previous = <CommandResponse> update;

        if (status) {
            showErrorMessage(l.sync.general.error.pushCommand(message), message);
        } else {
            info(l.sync.pushCommand.afterCreate.message);
        }
    })
}

function createCommand() {
    const inputBoxConstantOptions = <InputBoxOptions> {
        title: l.sync.createCommand.titles.title,
        placeHolder: l.sync.createCommand.placeholders.placeholder
    };

    inputBox(
        {
            ...inputBoxConstantOptions,
            prompt: l.sync.createCommand.promts.name 
        }
    ).then(input => {
        if (input) {
            const commandName = input;

            inputBox(
                {
                    ...inputBoxConstantOptions,
                    prompt: l.sync.createCommand.promts.trigger
                }
            ).then(async (input) => {
                if (input) {
                    const commandTrigger = input;

                    const create = await sync().then(sync => sync.createCommand({
                        commandName: commandName,
                        commandTrigger: commandTrigger,
                        commandCode: NEW_EMPTY_COMMAND
                    }));

                    const { status, message } = <RequestError> create;

                    if (status) {
                        showErrorMessage(l.sync.general.error.createCommand(message), message);
                    } else {
                        info(l.sync.createCommand.afterCreate.message, l.sync.createCommand.afterCreate.action).then(item => {
                            if (item == l.sync.createCommand.afterCreate.action) {
                                openCommandList();
                            }
                        });
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        } else {
            warn(l.general.actionCancelled);
        }
    });
}

function createVariable() {
    const inputBoxConstantOptions = <InputBoxOptions> {
        title: l.sync.createVariable.titles.title,
        placeHolder: l.sync.createVariable.placeholders.placeholder
    };

    inputBox(
        {
            ...inputBoxConstantOptions,
            prompt: l.sync.createVariable.promts.name
        }
    ).then(input => {
        if (input) {
            const variableName = input;

            inputBox(
                {
                    ...inputBoxConstantOptions,
                    prompt: l.sync.createVariable.promts.value
                }
            ).then(async (input) => {
                if (input) {
                    const variableValue = input;

                    const create = await sync().then(sync => sync.createVariable({
                        variableName: variableName,
                        variableValue: variableValue
                    }));

                    const { status, message } = <RequestError> create;

                    if (status) {
                        showErrorMessage(l.sync.general.error.createVariable(message), message);
                    } else {
                        info(l.sync.createVariable.afterCreate.message, l.sync.createVariable.afterCreate.action).then(item => {
                            if (item == l.sync.createVariable.afterCreate.action) {
                                // openVariableList();
                            }
                        });
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            })
        } else {
            warn(l.general.actionCancelled);
        }
    })
}

function openVariableList() {
    sync().then(sync => {
        sync.variableListQuickPick().then(list => {
            quickPick(
                list,
                {
                    title: l.sync.variableList.titles.title,
                    placeHolder: l.sync.variableList.placeholders.placeholder,
                    matchOnDetail: true
                }
            ).then(item => {
                if (item) {
                    if (item._error) {
                        info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(item._error));
                    } else {
                        const selectedVariable = item;
    
                        quickPick(
                            [
                                l.sync.modifyVariable.labels.name,
                                l.sync.modifyVariable.labels.value
                            ],
                            {
                                title: l.sync.modifyVariable.titles.title,
                                placeHolder: l.sync.modifyVariable.placeholders.placeholder
                            }
                        ).then(item => {
                            if (item) {
                                switch (item) {
                                    case l.sync.modifyVariable.labels.name:
                                        inputBox(
                                            {
                                                title: l.sync.modifyVariable.titles.name,
                                                prompt: l.sync.modifyVariable.promts.name,
                                                value: selectedVariable.label
                                            }
                                        ).then(async (input) => {
                                            if (input) {
                                                const update = await sync.updateVariable({
                                                    variableID: selectedVariable._id,
                                                    variableName: input
                                                });
        
                                                const { status, message } = <RequestError> update;
                                                // TODO Revert action as well
        
                                                if (status) {
                                                    showErrorMessage(l.sync.general.error.updateVariable(message), message);
                                                } else {
                                                    info(l.sync.modifyVariable.afterChange.name(input));
                                                }
                                            } else {
                                                warn(l.general.actionCancelled);
                                            }
                                        });
                                        break;
                                    case l.sync.modifyVariable.labels.value:
                                        inputBox(
                                            {
                                                title: l.sync.modifyVariable.titles.value,
                                                prompt: l.sync.modifyVariable.promts.value,
                                                value: selectedVariable.detail
                                            }
                                        ).then(async (input) => {
                                            if (input) {
                                                const update = await sync.updateVariable({
                                                    variableID: selectedVariable._id,
                                                    variableValue: input
                                                });
        
                                                const { status, message } = <RequestError> update;
                                                // TODO Revert action as well
        
                                                if (status) {
                                                    showErrorMessage(l.sync.general.error.updateVariable(message), message);
                                                } else {
                                                    info(l.sync.modifyVariable.afterChange.value(input));
                                                }
                                            } else {
                                                warn(l.general.actionCancelled);
                                            }
                                        });
                                        break;
                                }
                            } else {
                                warn(l.general.actionCancelled);
                            }
                        });
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        });
    });
}

function deleteCommand() {
    sync().then(sync => {
        sync.commandListQuickPick().then(list => {
            quickPick(
                list,
                {
                    title: l.sync.deleteCommand.titles.title,
                    placeHolder: l.sync.deleteCommand.placeholders.placeholder,
                    matchOnDetail: true,
                    canPickMany: true
                }
            ).then(async (items) => {
                if (items) {
                    if (items[0]._error) {
                        info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(items[0]._error));
                    } else {
                        for (const item of items) {
                            const deleteCommand = await sync.deleteCommand(item._id);
    
                            const { status, message } = <RequestError> deleteCommand;
                            // TODO Revert action as well
    
                            if (status) {
                                showErrorMessage(l.sync.general.error.deleteCommand(message), message);
                                return;
                            }
                        }
    
                        info(l.sync.deleteCommand.afterDeletion.message);
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        });
    });
}

function deleteVariable() {
    sync().then(sync => {
        sync.variableListQuickPick().then(list => {
            quickPick(
                list,
                {
                    title: l.sync.deleteVariable.titles.title,
                    placeHolder: l.sync.deleteVariable.placeholders.placeholder,
                    matchOnDetail: true,
                    canPickMany: true
                }
            ).then(async (items) => {
                if (items) {
                    if (items[0]._error) {
                        info(l.sync.general.error.messageCopied).then(() => env.clipboard.writeText(items[0]._error));
                    } else {
                        for (const item of items) {
                            const deleteVariable = await sync.deleteVariable(item._id);
    
                            const { status, message } = <RequestError> deleteVariable;
    
                            if (status) {
                                showErrorMessage(l.sync.general.error.deleteVariable(message), message);
                                return;
                            }
                        }
    
                        info(l.sync.deleteVariable.afterDeletion.message);
                    }
                } else {
                    warn(l.general.actionCancelled);
                }
            });
        });
    });
}
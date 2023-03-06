import * as vscode from 'vscode';
import * as l from './locale';

// Push
import pushCommand from './bdfd-sync-functions/pushCommand';
import pushVariable from './bdfd-sync-functions/pushVariable';
// Fetch
import fetchCommand from './bdfd-sync-functions/fetchCommand';
import fetchVariable from './bdfd-sync-functions/fetchVariable';
// Fetch List
import fetchBotList from './bdfd-sync-functions/fetchBotList';
import fetchCommandList from './bdfd-sync-functions/fetchCommandList';
import fetchVariableList from './bdfd-sync-functions/fetchVariableList';
// Create
import createCommand from './bdfd-sync-functions/createCommand';
import createVariable from './bdfd-sync-functions/createVariable';
// Delete
import deleteCommand from './bdfd-sync-functions/deleteCommand';
import deleteVariable from './bdfd-sync-functions/deleteVariable';
// Local data manager
import { writeSyncData, getSyncData, writeUserData, getUserData } from './bdfd-sync-functions/localData';

// Shortcuts
const win = vscode.window,
work = vscode.workspace,
cmds = vscode.commands,
info = win.showInformationMessage,
error = win.showErrorMessage,
warn = win.showWarningMessage,
IBox = win.showInputBox,
QPick = win.showQuickPick;

export function load() {
    // Notification about loading the experiment & First Set Up
    firstSetUp();
    // Set Up or Re-set Up
    setUpOrResetUpRegCmd();
    // Open command list
    openCommandListRegCmd();
    // Modify command data
    syncModifyRegCmd();
    // Push command to BDFD
    pushCommandRegCmd();
    // Open bot list
    openBotListRegCmd();
    // Create command
    createCommandRegCmd();
    // Create variable
    createVariableRegCmd();
    // Open variable list
    openVariableListRegCmd();
    // Delete command
    deleteCommandRegCmd();
    // Delete variable
    deleteVariableRegCmd();
}

function firstSetUp() {
    info(l.sync.setUp.greeting.message, l.sync.setUp.greeting.action)
        .then((value) => {
            if (value == l.sync.setUp.greeting.action) {
                IBox({
                    title: l.sync.setUp.titles.title,
                    placeHolder: l.sync.setUp.placeholders.token,
                    password: true
                })
                    .then(async (value) => {
                        if (value != undefined) {
                            const token = `default-sessionStore=${value}`;
                            (await writeUserData()).authToken(token);
                            info(l.sync.setUp.afterChange.message, l.sync.setUp.afterChange.action)
                                .then(async (value) => {
                                    if (value != undefined) {
                                        if (value == l.sync.setUp.afterChange.action) {
                                            await openBotListQuickPick();
                                        };
                                    };
                                });
                        } else {
                            warn(l.general.actionCancelled);
                        };
                    });
            };
        });
}

function setUpOrResetUpRegCmd() {
    cmds.registerCommand('bdfd.sync.setup', syncSetUpQuickPick);
}

function syncSetUpQuickPick() {
    QPick([
        {
            label: l.sync.setUp.labels.token,
            description: l.sync.setUp.descriptions.token
        },
        {
            label: l.sync.setUp.labels.bot,
            description: l.sync.setUp.descriptions.bot
        }
    ], {
        title: l.sync.setUp.titles.title,
        placeHolder: l.sync.setUp.placeholders.select,
        matchOnDescription:  true
    })
        .then(async (value) => {
            if (value != undefined) {
                switch (value.label) {
                    case l.sync.setUp.labels.token:
                        IBox({
                            title: l.sync.setUp.titles.token,
                            placeHolder: l.sync.setUp.placeholders.token,
                            password: true
                        })
                            .then(async (value) => {
                                if (value != undefined) {
                                    const authToken = `default-sessionStore=${value}`;
                                    (await writeUserData()).authToken(authToken);
                                    info(l.sync.setUp.afterChange.message, l.sync.setUp.afterChange.action)
                                        .then(async (value) => {
                                            if (value != undefined) {
                                                if (value == l.sync.setUp.afterChange.action) {
                                                    await openBotListQuickPick();
                                                };
                                            };
                                        });
                                } else {
                                    warn(l.general.actionCancelled);
                                };
                            });
                        break;
                    case l.sync.setUp.labels.bot:
                        await openBotListQuickPick();
                        break;
                };
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function openCommandListRegCmd() {
    cmds.registerCommand('bdfd.sync.openCommandList', openCommandListQuickPick);
}

async function openCommandListQuickPick() {
    const botID = (await getSyncData()).bot().botID,
    authToken = (await getUserData()).authToken(),
    CL = await fetchCommandList(botID, authToken);

    if (CL == undefined) return error(l.sync.general.tokenError);

    QPick(CL, {
        title: l.sync.commandList.titles.title,
        placeHolder: l.sync.commandList.placeholders.select,
        matchOnDetail: true
    })
        .then(async (value) => {
            if (value != undefined) {
                const commandID = value._id,
                    CD = await fetchCommand(botID, commandID, authToken);
                
                (await writeSyncData()).commandID(commandID);
                (await writeSyncData()).commandName(CD.commandName);
                (await writeSyncData()).commandTrigger(CD.commandTrigger);
                (await writeSyncData()).commandLanguage(CD.commandLanguage);
                (await writeSyncData()).commandLanguageID(CD.commandLanguageID);

                info(l.sync.commandList.afterSync.message, l.sync.commandList.afterSync.action)
                    .then((value) => {
                        if (value == l.sync.commandList.afterSync.action) {
                            work.openTextDocument({
                                language: 'bds',
                                content: CD.commandCode
                            });
                        };
                    });
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function syncModifyRegCmd() {
    cmds.registerCommand('bdfd.sync.modifyCommandData', syncModifyCommandData);
}

function syncModifyCommandData() {
    QPick([l.sync.modifyCommand.labels.name, l.sync.modifyCommand.labels.trigger, l.sync.modifyCommand.labels.language], {
        title: l.sync.modifyCommand.titles.title,
        placeHolder: l.sync.modifyCommand.placeholders.select.modify
    })
        .then((value) => {
            if (value != undefined) {
                switch (value) {
                    case l.sync.modifyCommand.labels.name:
                        IBox({
                            title: l.sync.modifyCommand.titles.name,
                            placeHolder: l.sync.modifyCommand.placeholders.type.name
                        })
                            .then(async (value) => {
                                if (value != undefined) {
                                    (await writeSyncData()).commandName(value);
                                    info(l.sync.modifyCommand.afterChange.name(value));
                                } else {
                                    warn(l.general.actionCancelled);
                                };
                            });
                        break;
                    case l.sync.modifyCommand.labels.trigger:
                        IBox({
                            title: l.sync.modifyCommand.titles.trigger,
                            placeHolder: l.sync.modifyCommand.placeholders.type.trigger
                        })
                            .then(async (value) => {
                                if (value != undefined) {
                                    (await writeSyncData()).commandTrigger(value);
                                    info(l.sync.modifyCommand.afterChange.trigger(value));
                                } else {
                                    warn(l.general.actionCancelled);
                                };
                            });
                        break;
                    case l.sync.modifyCommand.labels.language:
                        QPick(['BDScript', 'BDScript 2', 'BDScript Unstable', 'Javascript (ES5+BD.js)'], {
                            title: l.sync.modifyCommand.titles.language,
                            placeHolder: l.sync.modifyCommand.placeholders.select.language
                        })
                            .then(async (value) => {
                                if (value != undefined) {
                                    let lang: number = 0;
                                    if (value == 'BDScript') {
                                        lang = 0;
                                    };
                                    if (value == 'BDScript 2') {
                                        lang = 3;
                                    };
                                    if (value == 'BDScript Unstable') {
                                        lang = 2;
                                    };
                                    if (value == 'Javascript (ES5+BD.js)') {
                                        lang = 1;
                                    };
                                    (await writeSyncData()).commandLanguage(value);
                                    (await writeSyncData()).commandLanguageID(lang);
                                    info(l.sync.modifyCommand.afterChange.language(value));
                                } else {
                                    warn(l.general.actionCancelled);
                                };
                            });
                        break;
                };
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function pushCommandRegCmd() {
    cmds.registerCommand('bdfd.sync.pushCommand', pushCommandCmd);
}

async function pushCommandCmd() {
    const botID = (await getSyncData()).bot().botID,
    commandID = (await getSyncData()).commandID(),
    commandName = encodeURIComponent((await getSyncData()).commandName()),
    commandTrigger = encodeURIComponent((await getSyncData()).commandTrigger()),
    commandLanguageID = (await getSyncData()).commandLanguageID(),
    commandCode = encodeURIComponent(<string>win.activeTextEditor?.document.getText()),
    authToken = (await getUserData()).authToken();

    pushCommand(botID, commandID, commandName, commandTrigger, commandLanguageID, commandCode, authToken)
        .then((value) => {
            if (value) {
                info(l.sync.general.push.s);
            } else {
                error(l.sync.general.push.f);
            };
        });
    
}

function openBotListRegCmd() {
    cmds.registerCommand('bdfd.sync.openBotList', openBotListQuickPick);
}

async function openBotListQuickPick() {
    const BL = await fetchBotList((await getUserData()).authToken());

    if (BL == undefined) return error(l.sync.general.tokenError);
    
    QPick(BL, {
        title: l.sync.botList.titles.title,
        placeHolder: l.sync.botList.placeholders.placeholder,
        matchOnDetail: true
    })
        .then(async (value: any) => {
            if (value != undefined) {
                const botID: number = value._id;
                const botName: string = value.label;
                const commands: number = value._commands;
                const variables: number = value._variables;

                (await writeSyncData()).bot(botID, botName, commands, variables);

                await openCommandListQuickPick();
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function createCommandRegCmd() {
    cmds.registerCommand('bdfd.sync.createCommand', createCommandCmd);
}

async function createCommandCmd() {
    const botID = (await getSyncData()).bot().botID,
    authToken = (await getUserData()).authToken(),
    newCommandID = (await createCommand(botID, authToken))?.newCommandID;
    
    if (newCommandID != undefined) {
        await pushCommand(botID, newCommandID, 'NEW! [No name]', '', 3, '', authToken);
        info(l.sync.createCommand.afterCreate.message, l.sync.createCommand.afterCreate.action)
            .then((value) => {
                if (value == l.sync.createCommand.afterCreate.action) {
                    cmds.executeCommand('bdfd.sync.openCommandList');
                };
            });
    } else {
        error(l.sync.general.tokenError);
    };
}

function createVariableRegCmd() {
    cmds.registerCommand('bdfd.sync.createVariable', createVariableCmd);
}

async function createVariableCmd() {
    const botID = (await getSyncData()).bot().botID,
        authToken = (await getUserData()).authToken(),
        newVariableID = (await createVariable(botID, authToken))?.newVariableID;

    if (newVariableID != undefined) {
        await pushVariable(botID, newVariableID, 'NEW! [No name]', '', authToken);
        info(l.sync.createVariable.afterCreate.message, l.sync.createVariable.afterCreate.action)
            .then((value) => {
                if (value == l.sync.createVariable.afterCreate.action) {
                    cmds.executeCommand('bdfd.sync.openVariableList');
                };
            });
    } else {
        error(l.sync.general.tokenError);
    };
}

function openVariableListRegCmd() {
    cmds.registerCommand('bdfd.sync.openVariableList', openVariableListCmd);
}

async function openVariableListCmd() {
    const VL = await fetchVariableList((await getSyncData()).bot().botID, (await getUserData()).authToken());

    if (VL == undefined) return error(l.sync.general.tokenError);

    QPick(VL, {
        title: l.sync.variableList.titles.title,
        placeHolder: l.sync.variableList.placeholders.placeholder,
        matchOnDetail: true
    })
        .then((value) => {
            if (value != undefined) {
                const selection = value;
                QPick([l.sync.modifyVariable.labels.name, l.sync.modifyVariable.labels.value], {
                    title: l.sync.modifyVariable.titles.title,
                    placeHolder: l.sync.modifyVariable.placeholders.placeholder
                })
                    .then((value) => {
                        if (value != undefined) {
                            switch (value) {
                                case l.sync.modifyVariable.labels.name:
                                    IBox({
                                        title: l.sync.modifyVariable.titles.name,
                                        prompt: l.sync.modifyVariable.promts.name,
                                        value: selection.label
                                    })
                                        .then(async (value) => {
                                            if (value != undefined) {
                                                const botID = (await getSyncData()).bot().botID,
                                                    authToken = (await getUserData()).authToken(),
                                                    variable_value = (await fetchVariable(botID, selection._id, authToken)).variableValue;
                                                await pushVariable(botID, selection._id, value, variable_value, authToken)
                                                    .then((value: number) => {
                                                        if (value == 200) {
                                                            info(l.sync.general.push.s);
                                                        } else {
                                                            error(l.sync.general.push.f);
                                                        };
                                                    });
                                            } else {
                                                warn(l.general.actionCancelled);
                                            };
                                        });
                                    break;
                                case l.sync.modifyVariable.labels.value:
                                    IBox({
                                        title: l.sync.modifyVariable.titles.value,
                                        prompt: l.sync.modifyVariable.promts.value,
                                        value: selection.detail
                                    })
                                        .then(async (value) => {
                                            if (value != undefined) {
                                                const botID = (await getSyncData()).bot().botID,
                                                authToken = (await getUserData()).authToken(),
                                                variable_name = (await fetchVariable(botID, selection._id, authToken)).variableName;
                                            await pushVariable(botID, selection._id, variable_name, value, authToken)
                                                .then((value: number) => {
                                                    if (value == 200) {
                                                        info(l.sync.general.push.s);
                                                    } else {
                                                        error(l.sync.general.push.f);
                                                    };
                                                });
                                            } else {
                                                warn(l.general.actionCancelled);
                                            };
                                        });
                                    break;
                            };
                        } else {
                            warn(l.general.actionCancelled);
                        };
                    });
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function deleteCommandRegCmd() {
    cmds.registerCommand('bdfd.sync.deleteCommand', deleteCommandCmd);
}

async function deleteCommandCmd() {
    const botID = (await getSyncData()).bot().botID,
    authToken = (await getUserData()).authToken(),
    CL = await fetchCommandList(botID, authToken);

    if (CL == undefined) return error(l.sync.general.tokenError);

    QPick(CL, {
        title: l.sync.deleteCommand.titles.title,
        placeHolder: l.sync.deleteCommand.placeholders.placeholder,
        matchOnDetail: true,
        canPickMany: true
    })
        .then((value) => {
            if (value != undefined) {
                deleteCommand(botID, value, authToken);
                info(l.sync.deleteCommand.afterDeletion.message)
            } else {
                warn(l.general.actionCancelled);
            };
        });
}

function deleteVariableRegCmd() {
    cmds.registerCommand('bdfd.sync.deleteVariable', deleteVariableCmd);
}

async function deleteVariableCmd() {
    const botID = (await getSyncData()).bot().botID,
    authToken = (await getUserData()).authToken(),
    VL = await fetchVariableList(botID, authToken);

    if (VL == undefined) return error(l.sync.general.tokenError);

    QPick(VL, {
        title: l.sync.deleteVariable.titles.title,
        placeHolder: l.sync.deleteVariable.placeholders.placeholder,
        matchOnDetail: true,
        canPickMany: true
    })
        .then((value) => {
            if (value != undefined) {
                deleteVariable(botID, value, authToken);
                info(l.sync.deleteVariable.afterDeletion.message)
            } else {
                warn(l.general.actionCancelled);
            };
        });
}
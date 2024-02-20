import { l10n } from "vscode";

const { t } = l10n;

export const general = {
    actionCancelled: t('Action cancelled.')
};

export const autoCompletions = {
    required: t('Required'),
    notRequired: t('Not required'),
    canBeEmpty: t('Can be empty'),
    cannotBeEmpty: t("Can't be empty"),
    name: t('Name'),
    type: t('Type'),
    possibleValues: t('Possible values'),
    flags: t('Flags'),
    arguments: t('Arguments'),
    noArguments: t('No arguments')
};

export const statusItems = {
    functionList: {
        text: t('Function List'),
        commandTitle: t('Show List')
    },
    customizeHighlighting: {
        text: t('Customize Highlighting'),
        commandTitle: t('Show Editor')
    },
    extensionVersion: {
        text: t('Extension Version')
    },
    currentSyncedCommand: {
        name: t('Current Synced Command'),
        text: {
            unnamedCommand: t('Unnamed command'),
            nonTriggerableCommand: t('Non-triggerable')
        }
    }
};

export const commonCommands = {
    functionList: {
        intents: t('Intents'),
        premium: {
            text: t('Premium'),
            true: t('Yes'),
            false: t('No')
        },
        openWiki: t('Open wiki'),
        select: t('Select Function'),
    },
    customizeHighlighting: {
        quickPick: {
            foreground: {
                label: t('Foreground'),
                color: t('Foreground Color'),
                noColor: t('No Foreground Color'),
                change: t("Change the functions' foreground color"),
            },
            font: {
                label: t('Font'),
                style: t('Font Style'),
                noStyle: t('No Font Style'),
                change: t("Change the functions' font style"),
            }
        },
        inputBox: {
            general: {
                example: t('Example')
            },
            foreground: {
                changing: t('Changing Foreground Color')
            },
            font: {
                changing: t('Changing Font Style')
            }
        }
    }
};

export const syncFeature = {
    greeting: {
        featureAuthorized: (username: string) =>
            t('Welcome back, {username}!', { username }),
        featureUnauthorized: t("Dear User, you haven't authorized to use the Sync feature yet."),
        authorizeAction: t('Authorize now!')
    },
    command: {
        configureSyncFeature: {
            titles: {
                title: t('BDFD Sync Configuration'),
                token: t('Changing an auth token')
            },
            placeholders: {
                placeholder: t('Type your auth token here')
            }
        },
        switchAccount: {
            showInputBox: {
                title: {
                    addingAccount: t('Adding An Account'),
                },
                placeholder: {
                    inputAuthToken: t('Please input the auth token')
                }
            },
            showQuickPick: {
                title: {
                    general: t('Switching An Account'),
                    removingAccount: t('Removing An Account')
                },
                placeholder: {
                    accountsToRemove: t('Please select accounts you want to remove')
                },
                actions: [
                    t('Add an account'),
                    t('Remove an account')
                ]
            }
        }
    },
    treeViews: {
        openDialog: {
            label: t('Save bot commands here'),
            title: t('Please select a folder where the extension will store your bots with their commands as files')
        },
        showQuickPick: {
            title: {
                general: t('Choose An Action'),
                changingScriptingLanguage: t('Changing Scripting Language')
            },
            commands: {
                placeholder: (scriptingLanguageName: string) =>
                    t('Current Scripting Language: ${scriptingLanguageName}', { scriptingLanguageName }),
                actions: [
                    t('Edit Command Name'),
                    t('Edit Command Trigger'),
                    t('Change Scripting Language')
                ]
            },
            variables: {
                actions: [
                    t('Edit Variable Name'),
                    t('Edit Variable Value')
                ]
            }
        },
        showInputBox: {
            commands: {
                title: {
                    editingCommandName: t('Editing Command Name'),
                    editingCommandTrigger: t('Editing Command Trigger'),
                }
            },
            variables: {
                title: {
                    editingVariableName: t('Editing Variable Name'),
                    editingVariableValue: t('Editing Variable Value')
                }
            }
        },
        treeItems: {
            label: {
                unnamedCommand: t('Unnamed command'),
                unnamedVariable: t('Unnamed variable')
            },
            tooltip: {
                noValue: t('No value')
            },
            description: {
                nonTriggerable: t('Non-triggerable')
            }
        }
    }
};

export const richPresence = {
    label: t('{vscode} Extension', { vscode: 'VS Code' }),
    loginDetails: t('Thinking...'),
    details: (botName: string) => t('Working on {botName}!', { botName }),
    state: {
        unnamedCommand: t('Unnamed command'),
        nontriggerable: t('Non-triggerable')
    }
};

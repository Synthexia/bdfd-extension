import { l10n } from "vscode";

const { t, bundle } = l10n;

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
            general: {
                example: t('Example')
            },
            foreground: {
                foreground: t('Foreground'),
                color: t('Foreground Color'),
                change: t("Change the function's foreground color"),
                changing: t('Changing Foreground Color'),
            },
            font: {
                font: t('Font'),
                style: t('Font Style'),
                change: t("Change the function's font style"),
                changing: t('Changing Font Style'),
            }
        }
    }
};

export const syncFeature = {
    greeting: {
        featureAuthorized: (username: string) => t('Welcome back, {username}!', { username }),
        featureUnauthorized: t("Dear User, you haven't authorized to use the Sync feature yet."),
        authorizeAction: t('Authorize now!')
    },
    error: {
        copy: {
            text: t('Select to copy this error message'),
            action: t('Copy Error'),
            copied: t('The error message was copied!')
        },
        command: {
            openBotList: t('Failed to get bots'),
            openCommandList: t('Failed to get commands'),
            openVariableList: t('Failed to get variables'),
            openCommand: (errorMessage: string) => t('Failed to sync with this command: {errorMessage}', { errorMessage }),
            pushCommand: (errorMessage: string) => t('Failed to update this command: {errorMessage}', { errorMessage }),
            pushVariable: (errorMessage: string) => t('Failed to update this variable: {errorMessage}', { errorMessage }),
            createCommand: (errorMessage: string) => t('Failed to create a new command: {errorMessage}', { errorMessage }),
            createVariable: (errorMessage: string) => t('Failed to create a new variable: {errorMessage}', {  errorMessage }),
            updateCommand: (errorMessage: string) => t('Failed to update this command: {errorMessage}', { errorMessage }),
            updateVariable: (errorMessage: string) => t('Failed to update this variable: {errorMessage}', { errorMessage }),
            deleteCommand: (errorMessage: string) => t('Failed to delete selected commands: {errorMessage}', { errorMessage }),
            deleteVariable: (errorMessage: string) => t('Failed to delete selected variables: {errorMessage}', { errorMessage })
        }
    },
    command: {
        configureSyncFeature: {
            titles: {
                title: t('BDFD Sync Configuration'),
                token: t('Changing an auth token')
            },
            placeholders: {
                select: t('Select what you would like to change'),
                token: t('Type your auth token here')
            },
            descriptions: {
                token: t('Change an auth token for syncing'),
                bot: t('Change a bot for syncing')
            },
            labels: {
                token: t('Auth token'),
                bot: t('Bot')
            },
            changed: {
                message: t('Successfully set! Try opening a bot list!'),
                action: t('Bot List')
            }
        },
        openCommandList: {
            titles: {
                title: t('Command List')
            },
            placeholders: {
                select: t('Select a command with which you would like to sync at the moment')
            },
            synced: {
                message: t('Synced! Would you like to create an untitled file with content of this command?'),
                action: t('Create!')
            }
        },
        modifyCommand: {
            titles: {
                title: t('Modifying Command Data'),
                name: t('Modifying Command Name'),
                trigger: t('Modifying Command Trigger'),
                language: t('Modifying Command Language')
            },
            placeholders: {
                select: {
                    choose: t('Choose what you would like to modify'),
                    language: t('Select the new command language')
                },
                type: {
                    name: t('Type the new command name here'),
                    trigger: t('Type the new command trigger here')
                }
            },
            labels: {
                name: t('Name'),
                trigger: t('Trigger'),
                language: t('Language')
            },
            modified: {
                name: (name: string) => t('The command name was successfully changed to "{name}"!', { name }),
                trigger: (trigger: string) => t('The command trigger was successfully changed to "{trigger}"!', { trigger }),
                language: (language: string) => t('The command language was successfully changed to "{language}"!', { language })
            }
        },
        openBotList: {
            titles: {
                title: t('Bot List')
            },
            placeholders: {
                placeholder: t('Select a bot with which you would like to sync at the moment, then select a command')
            },
            synced: (botName: string, commands: string, variables: string) => t('Now you are synced with the "{botName}" bot which currently has {commands} and {variables}!', { botName, commands, variables })
        },
        pushCommand: {
            pushed: {
                message: t('Command updated!')
            }
        },
        createCommand: {
            titles: {
                title: t('Creating a new command')
            },
            placeholders: {
                placeholder: t('Please type initial command data')
            },
            promts: {
                name: t('Please type a command name'),
                trigger: t('Please type a command trigger')
            },
            created: {
                message: t('Command created!'),
                action: t('Open Command List')
            },
            createVariable: {
                titles: {
                    title: t('Creating a new variable')
                },
                placeholders: {
                    placeholder: t('Please type initial variable data')
                },
                promts: {
                    name: t('Please type a variable name'),
                    value: t('Please type a variable value')
                },
                created: {
                    message: t('Variable created!'),
                    action: t('Open Variable List')
                }
            },
            openVariableList: {
                titles: {
                    title: t('Variable List')
                },
                placeholders: {
                    placeholder: t('Select a variable which you would like to modify.')
                }
            },
            modifyVariable: {
                titles: {
                    title: t('Modifying variable'),
                    name: t('Modifying Variable Name'),
                    value: t('Modifying Variable Value')
                },
                placeholders: {
                    placeholder: t('Select what you would like to modify')
                },
                labels: {
                    name: t('Name'),
                    value: t('Value')
                },
                promts: {
                    name: t('Type the new variable name'),
                    value: t('Type the new variable value')
                },
                modified: {
                    name: (name: string) => t('The variable name was successfully changed to "{name}"!', { name }),
                    value: (value: string) => t('The variable value was successfully changed to "{value}"!', { value })
                }
            },
            deleteCommand: {
                titles: {
                    title: t('Command Deletion')
                },
                placeholders: {
                    placeholder: t('Select commands which you would like to delete.')
                },
                deleted: {
                    message: t('Selected commands were deleted!')
                }
            },
            deleteVariable: {
                titles: {
                    title: t('Variable Deletion')
                },
                placeholders: {
                    placeholder: t('Select variables which you would like to delete.')
                },
                deleted: {
                    message: t('Selected variables were deleted!')
                }
            }
        }
    }
};

export default {
    general,
    autoCompletions,
    statusItems,
    commonCommands,
    syncFeature
};

import { l10n } from 'vscode';

const t = l10n.t;

const locale = {
    general: {
        unknownError: t('An unknown error has occured. The extension may not be able to function correctly. Details'),
        actionCancelled: t('Action cancelled.'),
        experimentsLoader: {
            completions: t('{0}: Auto Completions Loaded', 'BDFD Experiments'),
            sync: t('{0}: Sync Loaded', 'BDFD Experiments')
        }
    },
    bars: {
        funcList: {
            text: t('Function List'),
            commandTitle: t('Show List')
        },
        customize: {
            text: t('Customize Highlighting'),
            commandTitle: t('Show Editor')
        },
        version: {
            text: t('Extension Version')
        },
        completions: {
            text: t('(E) Auto Completions enabled'),
            detail: t('Available'),
        }
    },
    funcList: {
        load: {
            s: t('{0} - Successfully loaded', 'BDFD Function List'),
            f: t('{0} - Failed to load. Details', 'BDFD Function List')
        },
        quickPick: {
            intents: t('Intents'),
            premium: t('Premium'),
            openWiki: t('Open wiki'),
            select: t('Select Function'),
            fetchError: function (status: number) {
                return t('An error occured while fetching a function info! (S{status})', { status: status })
            }
        }
    },
    customize: {
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
    },
    sync: {
        general: {
            tokenError: t('Invalid Or Expired Auth Token Was Provided!'),
            push: {
                s: t('Pushed successfully!'),
                f: t('Pushed unseccessfully... It seems that something went wrong! Maybe invalid or expired auth token was provided?'),
            }
        },
        setUp: {
            titles: {
                title: t('BDFD Sync Set Up'),
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
            afterChange: {
                message: t('Successfully set! Try opening a bot list to see if you typed an auth token correctly. If it is empty, then you typed it wrongly and you will have to re-set up it.'),
                action: t('Bot List')
            },
            greeting: {
                message: t("{0}: BDFD Sync Loaded. If you haven't done the first set up, you must do it!", 'BDFD Experiments'),
                action: t('Set Up')
            }
        },
        commandList: {
            titles: {
                title: t('Command List')
            },
            placeholders: {
                select: t('Select a command with which you would like to sync at the moment')
            },
            afterSync: {
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
                    modify: t('Choose what you would like to modify'),
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
            afterChange: {
                name: function (name: string) {
                    return t('The command name was successfully changed to "{name}"!', { name: name });
                },
                trigger: function (trigger: string) {
                    return t('The command trigger was successfully changed to "{trigger}"!', { trigger: trigger });
                },
                language: function (language: string) {
                    return t('The command language was successfully changed to "{language}"!', { language: language });
                }
            }
        },
        botList: {
            titles: {
                title: t('Bot List')
            },
            placeholders: {
                placeholder: t('Select a bot with which you would like to sync at the moment, then select a command')
            }
        },
        createCommand: {
            afterCreate: {
                message: t('Command created! Its name contains "{tag}" tag.', { tag: 'NEW!' }),
                action: t('Open Command List')
            }
        },
        createVariable: {
            afterCreate: {
                message: t('Variable created! Its name contains "{tag}" tag.', { tag: 'NEW!' }),
                action: t('Open Variable List')
            }
        },
        variableList: {
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
            }
        },
        deleteCommand: {
            titles: {
                title: t('Command Deletion')
            },
            placeholders: {
                placeholder: t('Select commands which you would like to delete.')
            },
            afterDeletion: {
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
            afterDeletion: {
                message: t('Selected variables were deleted!')
            }
        }
    },
    completions: {
        required_1: t('Required'),
        required_2: t('Not required'),
        empty_1: t('Can be empty'),
        empty_2: t('Cannot be empty'),
        name: t('Name'),
        type: t('Type'),
        values: t('Possible values'),
        flags: t('Flags'),
        arguments_1: t('Arguments'),
        arguments_2: t('No arguments')
    }
};

export = locale;

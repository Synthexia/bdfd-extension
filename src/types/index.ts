import { PathLike } from "fs";
import { Uri } from "vscode";

export enum StatusItem {
    FUNCTION_LIST = 0,
    CUSTOMIZE_TOKENS = 1,
    SYNC_FEATURE = 2,
    EXTENSION_VERSION = 3
}

export namespace Sync {
    export namespace Function {
        export type BotList = Promise<QuickPick.BotList[]>;
        export type CommandList = Promise<QuickPick.CVL[]>;
        export type VariableList = Promise<QuickPick.CVL[]>;
    }
    
    export namespace QuickPick {
        /**
         * Command & Variable List
         */
        export interface CVL {
            label: string;
            detail: string;
            _id: string;
            _error: string;
        }

        export interface BotList extends CVL {
            _commands: string;
            _variables: string;
        }
    }

    export namespace LocalDataManager {
        export namespace Function {
            export namespace Write {
                export type User = Promise<void>;
                export type Sync = Promise<void>;
            }

            export namespace Get {
                export type User = Promise<Data.User.User | Data.User.Object>;
                export type Sync = Promise<Data.Sync.Sync | Data.Sync.Object>;
            }
        }
        
        export namespace Data {
            export namespace User {
                export type User = string | BotList[] | WorkspaceList[];

                export interface Object {
                    authToken: string;
                    botList: BotList[];
                    workspaceList: WorkspaceList[];
                }
            }

            export namespace Sync {
                export type Sync = string | Command.Data;

                export interface Object {
                    botID: string;
                    commandData: Command.Data;
                }
            }
        }

        export namespace Entries {
            export enum User {
                AUTH_TOKEN = 'authToken',
                BOT_LIST = 'botList',
                WORKSPACE_LIST = 'workspaceList'
            }
    
            export enum Sync {
                BOT = 'bot',
                COMMAND_DATA = 'commandData'
            }
        }

        export namespace Command {
            export interface Data {
                commandID: string;
                commandName: string;
                commandTrigger: string;
                commandLanguage: LanguageData;
            }
            
            export interface LanguageData {
                name: string;
                id: string;
            }
        }

        export interface BotList {
            botID: string,
            botName: string,
            commands: string,
            variables: string;
        }

        export interface WorkspaceList {
            dataFile: PathLike,
            name: string,
            path: {
                fs: PathLike,
                uri: Uri
            }
        }
    }
}

export namespace Language {
    export enum Name {
        BDS = 'BDScript',
        BDS2 = 'BDScript 2',
        BDSU = 'BDScript Unstable',
        JS = 'Javascript (ES5+BD.js)'
    }

    export enum Id {
        BDS = '0',
        BDS2 = '3',
        BDSU = '2',
        JS = '1'
    }
}

export namespace CommonCommands {
    export namespace TextMate {
        export enum UpdateType {
            FOREGROUND = 'foreground',
            STYLE = 'style'
        }

        export interface Rules {
            name: string;
            scope: string;
            settings: Settings;
        }

        export interface Settings {
            foreground: string;
            fontStyle: string;
        }

        export interface Options {
            foreground: string;
            fontStyle: string;
            scope: string;
            label?: string;
        }

        export interface QuickPickItem {
            description: string;
            foreground: string;
            fontStyle: string;
            scope: string;
            label: string;
            name?: string;
        }
    }
}

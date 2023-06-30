import type { PathLike } from "fs";
import { Uri } from "vscode";

export namespace Sync {
     namespace QuickPick {
        /**
         * Command & Variable List
         */
         interface CVL {
            label: string;
            detail: string;
            _id: string;
            _error: string;
        }

         interface BotList extends CVL {
            _commands: string;
            _variables: string;
        }
    }

     namespace LocalDataManager {
         namespace Function {
             namespace Write {
                 type User = Promise<void>;
                 type Sync = Promise<void>;
            }

             namespace Get {
                 type User = Promise<Data.User.User | Data.User.Object>;
                 type Sync = Promise<Data.Sync.Sync | Data.Sync.Object>;
            }
        }
        
         namespace Data {
             namespace User {
                 type User = string | BotList[] | WorkspaceList[];

                 interface Object {
                    authToken: string;
                    botList: BotList[];
                    workspaceList: WorkspaceList[];
                }
            }

             namespace Sync {
                 type Sync = string | Command.Data;

                 interface Object {
                    botID: string;
                    commandData: Command.Data;
                }
            }
        }
         namespace Command {
             interface Data {
                commandID: string;
                commandName: string;
                commandTrigger: string;
                commandLanguage: LanguageData;
            }
            
             interface LanguageData {
                name: string;
                id: string;
            }
        }

         interface BotList {
            botID: string,
            botName: string,
            commands: string,
            variables: string;
        }

         interface WorkspaceList {
            dataFile: PathLike,
            name: string,
            path: {
                fs: PathLike,
                uri: Uri
            }
        }
    }
}

export namespace CommonCommands {
     namespace TextMate {
         interface Rules {
            name: string;
            scope: string;
            settings: Settings;
        }

         interface Settings {
            foreground: string;
            fontStyle: string;
        }

         interface Options {
            foreground: string;
            fontStyle: string;
            scope: string;
            label?: string;
        }

         interface QuickPickItem {
            description: string;
            foreground: string;
            fontStyle: string;
            scope: string;
            label: string;
            name?: string;
        }
    }
}

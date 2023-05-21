import { PathLike } from "fs";
import { Uri } from "vscode";

export type UserEntry = 'authToken' | 'botList' | 'workspaceList';
export type SyncEntry = 'bot' | 'commandData';

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

export interface CommandData {
    commandID: string;
    commandName: string;
    commandTrigger: string;
    commandLanguage: LanguageData;
}

export interface LanguageData {
    name: string;
    id: string;
}

export type UserData = string | BotList[] | WorkspaceList[];
export type SyncData = string | CommandData;

export interface UserDataObject {
    authToken: string;
    botList: BotList[];
    workspaceList: WorkspaceList[];
}

export interface SyncDataObject {
    botID: string;
    commandData: CommandData;
}

export type WriteUserData = Promise<void>;
export type GetUserData = Promise<string | BotList[] | WorkspaceList[] | UserDataObject>;

export type WriteSyncData = Promise<void>;
export type GetSyncData = Promise<string | CommandData | SyncDataObject>;

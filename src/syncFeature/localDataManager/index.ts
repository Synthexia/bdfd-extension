import { platform } from "os";
import { access, mkdir, readFile, writeFile } from "fs/promises";

import { EMPTY } from "../../generalConsts";
import { LOCAL_DATA } from "../consts";
import { Uri } from "vscode";
import { UserEntry, SyncEntry, WorkspaceEntry } from "./enums";

declare namespace LocalDataManager {
    namespace Data {
        namespace User {
            interface Object {
                authToken: string;
                botList: Bot.Data[];
            }
        }

        namespace Sync {
            interface Object {
                botID: string;
                commandData: Command.Data;
            }
        }

        namespace Workspace {
            interface Data {
                root: string,
                bots: Bots
            }

            type Bots = Record<string, BotCommands>;
            type BotCommands = Record<string, string> | undefined;
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

    namespace Bot {
        interface Data {
            botID: string,
            botName: string,
            commands: string,
            variables: string;
        }
    }
}

const isWindows = () => platform() === 'win32';

export default class LocalData {
    private readonly initUserData = JSON.stringify({ authToken: EMPTY });
    private readonly initSyncData = JSON.stringify({
        botID: EMPTY,
        commandData: {
            commandID: EMPTY,
            commandName: EMPTY,
            commandTrigger: EMPTY,
            commandLanguage: {
                name: EMPTY,
                id: EMPTY
            }
        }
    });
    private readonly initWorkspaceData = JSON.stringify({
        root: EMPTY,
        bots: {}
    });

    private userDataPath = EMPTY;
    private syncDataPath = EMPTY;
    private workspaceDataPath = EMPTY;
    
    public async init() {
        const path = process.env[isWindows() ? 'USERPROFILE' : 'HOME'] || process.cwd();
        const dataDir = path + LOCAL_DATA.ROOT + LOCAL_DATA.DIR;

        this.userDataPath = dataDir + LOCAL_DATA.FILE.USER;
        this.syncDataPath = dataDir + LOCAL_DATA.FILE.SYNC;
        this.workspaceDataPath = dataDir + LOCAL_DATA.FILE.WORKSPACE;

        await mkdir(dataDir, { recursive: true });
        await Promise.all([
            access(this.userDataPath).catch(async () => {
                await writeFile(this.userDataPath, this.initUserData);
            }),
            access(this.syncDataPath).catch(async () => {
                await writeFile(this.syncDataPath, this.initSyncData);
            }),
            access(this.workspaceDataPath).catch(async () => {
                await writeFile(this.workspaceDataPath, this.initWorkspaceData);
            })
        ]);

        return this;
    }


    public async writeUserData(
        options:
            | { entry: UserEntry.AuthToken, data: string }
            | { entry: UserEntry.BotList, data: LocalDataManager.Bot.Data[] }
    ): Promise<void> {
        const userDataObject = await this.getUserData();

        switch (options.entry) {
            case UserEntry.AuthToken:
                userDataObject.authToken = options.data;
                break;
            case UserEntry.BotList:
                userDataObject.botList = options.data;
                break;
        }

        await writeFile(this.userDataPath, JSON.stringify(userDataObject));
    }

    public async getUserData(entry: UserEntry.AuthToken): Promise<string>;
    public async getUserData(entry: UserEntry.BotList): Promise<LocalDataManager.Bot.Data[]>;
    public async getUserData(): Promise<LocalDataManager.Data.User.Object>;

    public async getUserData(entry?: UserEntry) {
        const buffer = await readFile(this.userDataPath);
        const userDataObject: LocalDataManager.Data.User.Object = JSON.parse(buffer.toString());

        switch (entry) {
            case UserEntry.AuthToken:
                return userDataObject.authToken;
            case UserEntry.BotList:
                return userDataObject.botList;
            default:
                return userDataObject;
        }
    }

    public async writeSyncData(
        options:
            | { entry: SyncEntry.Bot, data: string }
            | { entry: SyncEntry.CommandData, data: Partial<LocalDataManager.Command.Data> }
    ): Promise<void> {
        const syncDataObject = await this.getSyncData();

        switch (options.entry) {
            case SyncEntry.Bot:
                syncDataObject.botID = options.data;
                break;
            case SyncEntry.CommandData:
                syncDataObject.commandData = {
                    ...syncDataObject.commandData,
                    ... options.data
                };
                break;
        }

        await writeFile(this.syncDataPath, JSON.stringify(syncDataObject));
    }

    public async getSyncData(entry: SyncEntry.Bot): Promise<string>;
    public async getSyncData(entry: SyncEntry.CommandData): Promise<LocalDataManager.Command.Data>;
    public async getSyncData(): Promise<LocalDataManager.Data.Sync.Object>;

    public async getSyncData(entry?: SyncEntry) {
        const buffer = await readFile(this.syncDataPath);
        const syncDataObject: LocalDataManager.Data.Sync.Object = JSON.parse(buffer.toString());

        switch (entry) {
            case SyncEntry.Bot:
                return syncDataObject.botID;
            case SyncEntry.CommandData:
                return syncDataObject.commandData;
            default:
                return syncDataObject;
        }
    }

    public async writeWorkspaceData(options: {
        entry: WorkspaceEntry.Root,
        path: string
    }): Promise<undefined>;
    public async writeWorkspaceData(options: {
        entry: WorkspaceEntry.BotCommands,
        botID: string,
        commandID: string,
        commandCode: string
    }): Promise<Uri>;

    public async writeWorkspaceData(
        options:
            | { entry: WorkspaceEntry.Root, path: string }
            | { entry: WorkspaceEntry.BotCommands, botID: string, commandID: string, commandCode: string }
    ) {
        const workspaceDataObject = await this.getWorkspaceData();

        switch (options.entry) {
            case WorkspaceEntry.Root:
                workspaceDataObject.root = options.path;
                return;
            case WorkspaceEntry.BotCommands:
                const commandPath = workspaceDataObject.root + `/${options.botID}/${options.commandID}.bds`;

                workspaceDataObject.bots[options.botID] = {
                    ...workspaceDataObject.bots[options.botID],
                    [options.commandID]: commandPath
                };

                await writeFile(commandPath, options.commandCode);
                await writeFile(this.workspaceDataPath, JSON.stringify(workspaceDataObject));

                return Uri.file(commandPath);
        }
    }

    public async getWorkspaceData(options: {
        entry: WorkspaceEntry.Root
    }): Promise<string>;
    public async getWorkspaceData(options: {
        entry: WorkspaceEntry.BotList
    }): Promise<LocalDataManager.Data.Workspace.Bots>;
    public async getWorkspaceData(options: {
        entry: WorkspaceEntry.BotCommands,
        botID: string
    }): Promise<LocalDataManager.Data.Workspace.BotCommands>;
    public async getWorkspaceData(options: {
        entry: WorkspaceEntry.CommandPath,
        botID: string,
        commandID: string
    }): Promise<string>;
    public async getWorkspaceData(): Promise<LocalDataManager.Data.Workspace.Data>;


    public async getWorkspaceData(
        options?:
            | { entry: WorkspaceEntry.Root  | WorkspaceEntry.BotList }
            | { entry: WorkspaceEntry.BotCommands, botID: string }
            | { entry: WorkspaceEntry.CommandPath, botID: string, commandID: string }
    ) {
        const buffer = await readFile(this.workspaceDataPath);
        const workspaceDataObject: LocalDataManager.Data.Workspace.Data = JSON.parse(buffer.toString());

        switch (options?.entry) {
            case WorkspaceEntry.Root:
                return workspaceDataObject.root;
            case WorkspaceEntry.BotList:
                return workspaceDataObject.bots;
            case WorkspaceEntry.BotCommands:
                return workspaceDataObject.bots[options.botID];
            case WorkspaceEntry.CommandPath:
                return workspaceDataObject.bots[options.botID]?.[options.commandID];
            default:
                return workspaceDataObject;
        }
    }
}

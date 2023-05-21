import {
    access,
    mkdir,
    readFile,
    writeFile
} from "fs/promises";
import type {
    BotList,
    CommandData,
    GetSyncData,
    GetUserData,
    SyncData,
    SyncDataObject,
    SyncEntry,
    UserData,
    UserDataObject,
    UserEntry,
    WorkspaceList,
    WriteSyncData,
    WriteUserData
} from "../../types/syncFeature/localDataManager";
import {
    ENTRY,
    LOCAL_DATA
} from "../consts";
import {
    EMPTY,
    EMPTY_ARRAY
} from "../../generalConsts";

export class LocalData {
    private initUserData = JSON.stringify({
        authToken: EMPTY,
        botList: EMPTY_ARRAY,
        workspaceList: EMPTY_ARRAY
    });

    private initSyncData = JSON.stringify({
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
    
    private async init() {
        await access(LOCAL_DATA.PRE_PATH).catch(() => mkdir(LOCAL_DATA.PRE_PATH));
        await access(LOCAL_DATA.PATH).catch(() => mkdir(LOCAL_DATA.PATH));
        await Promise.all([
            access(LOCAL_DATA.DATA.USER).catch(() => writeFile(LOCAL_DATA.DATA.USER, this.initUserData)),
            access(LOCAL_DATA.DATA.SYNC).catch(() => writeFile(LOCAL_DATA.DATA.SYNC, this.initSyncData))
        ]);
    }

    constructor() {
        this.init();
    }


    public async writeUserData(entry: UserEntry, data: UserData): WriteUserData {
        const userDataObject = <UserDataObject> await this.getUserData();

        switch (entry) {
            case ENTRY.USER.AUTH_TOKEN:
                userDataObject.authToken = <string> data;
                break;
            case ENTRY.USER.BOT_LIST:
                userDataObject.botList = <BotList[]> data;
                break;
            case ENTRY.USER.WORKSPACE_LIST:
                userDataObject.workspaceList = <WorkspaceList[]> data;
                break;
        }

        await writeFile(LOCAL_DATA.DATA.USER, JSON.stringify(userDataObject));
    }

    public async getUserData(entry?: UserEntry): GetUserData {
        const
            buffer = await readFile(LOCAL_DATA.DATA.USER),
            userDataObject: UserDataObject = JSON.parse(buffer.toString())
        ;

        if (!entry) return userDataObject;

        switch (entry) {
            case ENTRY.USER.AUTH_TOKEN:
                return userDataObject.authToken;
            case ENTRY.USER.BOT_LIST:
                return userDataObject.botList;
            case ENTRY.USER.WORKSPACE_LIST:
                return userDataObject.workspaceList;
        }
    }

    public async writeSyncData(entry: SyncEntry, data: SyncData): WriteSyncData {
        const syncDataObject = <SyncDataObject> await this.getSyncData();

        switch (entry) {
            case ENTRY.SYNC.BOT:
                syncDataObject.botID = <string> data;
                break;
            case ENTRY.SYNC.COMMAND_DATA:
                syncDataObject.commandData = {
                    ...syncDataObject.commandData,
                    ... <CommandData> data
                };
                break;
        }

        await writeFile(LOCAL_DATA.DATA.SYNC, JSON.stringify(syncDataObject));
    }

    public async getSyncData(entry?: SyncEntry): GetSyncData {
        const
            buffer = await readFile(LOCAL_DATA.DATA.SYNC),
            syncDataObject: SyncDataObject = JSON.parse(buffer.toString())
        ;

        if (!entry) return syncDataObject;

        switch (entry) {
            case ENTRY.SYNC.BOT:
                return syncDataObject.botID;
            case ENTRY.SYNC.COMMAND_DATA:
                return syncDataObject.commandData;
        }
    }
}

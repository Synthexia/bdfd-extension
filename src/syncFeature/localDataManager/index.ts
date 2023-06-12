import {
    access,
    mkdir,
    readFile,
    writeFile
} from "fs/promises";
import {
    EMPTY,
    EMPTY_ARRAY
} from "../../generalConsts";
import { LOCAL_DATA } from "../consts";
import { Sync } from "../../types";

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


    public async writeUserData(entry: Sync.LocalDataManager.Entries.User, data: Sync.LocalDataManager.Data.User.User): Sync.LocalDataManager.Function.Write.User {
        const userDataObject = <Sync.LocalDataManager.Data.User.Object> await this.getUserData();

        switch (entry) {
            case Sync.LocalDataManager.Entries.User.AUTH_TOKEN:
                userDataObject.authToken = <string> data;
                break;
            case Sync.LocalDataManager.Entries.User.BOT_LIST:
                userDataObject.botList = <Sync.LocalDataManager.BotList[]> data;
                break;
            case Sync.LocalDataManager.Entries.User.WORKSPACE_LIST:
                userDataObject.workspaceList = <Sync.LocalDataManager.WorkspaceList[]> data;
                break;
        }

        await writeFile(LOCAL_DATA.DATA.USER, JSON.stringify(userDataObject));
    }

    public async getUserData(entry?: Sync.LocalDataManager.Entries.User): Sync.LocalDataManager.Function.Get.User {
        const
            buffer = await readFile(LOCAL_DATA.DATA.USER),
            userDataObject: Sync.LocalDataManager.Data.User.Object = JSON.parse(buffer.toString())
        ;

        if (!entry) return userDataObject;

        switch (entry) {
            case Sync.LocalDataManager.Entries.User.AUTH_TOKEN:
                return userDataObject.authToken;
            case Sync.LocalDataManager.Entries.User.BOT_LIST:
                return userDataObject.botList;
            case Sync.LocalDataManager.Entries.User.WORKSPACE_LIST:
                return userDataObject.workspaceList;
        }
    }

    public async writeSyncData(entry: Sync.LocalDataManager.Entries.Sync, data: Sync.LocalDataManager.Data.Sync.Sync): Sync.LocalDataManager.Function.Write.Sync {
        const syncDataObject = <Sync.LocalDataManager.Data.Sync.Object> await this.getSyncData();

        switch (entry) {
            case Sync.LocalDataManager.Entries.Sync.BOT:
                syncDataObject.botID = <string> data;
                break;
            case Sync.LocalDataManager.Entries.Sync.COMMAND_DATA:
                syncDataObject.commandData = {
                    ...syncDataObject.commandData,
                    ... <Sync.LocalDataManager.Command.Data> data
                };
                break;
        }

        await writeFile(LOCAL_DATA.DATA.SYNC, JSON.stringify(syncDataObject));
    }

    public async getSyncData(entry?: Sync.LocalDataManager.Entries.Sync): Sync.LocalDataManager.Function.Get.Sync {
        const
            buffer = await readFile(LOCAL_DATA.DATA.SYNC),
            syncDataObject: Sync.LocalDataManager.Data.Sync.Object = JSON.parse(buffer.toString())
        ;

        if (!entry) return syncDataObject;

        switch (entry) {
            case Sync.LocalDataManager.Entries.Sync.BOT:
                return syncDataObject.botID;
            case Sync.LocalDataManager.Entries.Sync.COMMAND_DATA:
                return syncDataObject.commandData;
        }
    }
}

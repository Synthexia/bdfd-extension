import { platform } from "os";
import {
    access,
    mkdir,
    readFile,
    writeFile
} from "fs/promises";

import {
    USER_ENTRIES,
    SYNC_ENTRIES
} from "./enums";
import type { Sync } from "../../../types";

import { EMPTY } from "../../generalConsts";
import { LOCAL_DATA } from "../consts";

const isWindows = () => platform() === 'win32';

export default class LocalData {
    private initUserData = JSON.stringify({
        authToken: EMPTY
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

    private userDataPath = '';
    private syncDataPath = '';
    
    private async init() {
        const path = process.env[isWindows() ? 'USERPROFILE' : 'HOME'] || process.cwd();
        const dataDir = path + LOCAL_DATA.ROOT + LOCAL_DATA.DIR;

        this.userDataPath = dataDir + LOCAL_DATA.FILE.USER;
        this.syncDataPath = dataDir + LOCAL_DATA.FILE.SYNC;

        await mkdir(dataDir, { recursive: true });
        await Promise.all([
            access(this.userDataPath).catch(async () => {
                await writeFile(this.userDataPath, this.initUserData);
            }),
            access(this.syncDataPath).catch(async () => {
                await writeFile(this.syncDataPath, this.initSyncData);
            })
        ]);
    }

    constructor() {
        this.init();
    }


    public async writeUserData(entry: USER_ENTRIES, data: Sync.LocalDataManager.Data.User.User): Sync.LocalDataManager.Function.Write.User {
        const userDataObject = <Sync.LocalDataManager.Data.User.Object> await this.getUserData();

        switch (entry) {
            case USER_ENTRIES.AUTH_TOKEN:
                userDataObject.authToken = <string> data;
                break;
            case USER_ENTRIES.BOT_LIST:
                userDataObject.botList = <Sync.LocalDataManager.BotList[]> data;
                break;
            case USER_ENTRIES.WORKSPACE_LIST:
                userDataObject.workspaceList = <Sync.LocalDataManager.WorkspaceList[]> data;
                break;
        }

        await writeFile(this.userDataPath, JSON.stringify(userDataObject));
    }

    public async getUserData(entry?: USER_ENTRIES): Sync.LocalDataManager.Function.Get.User {
        const buffer = await readFile(this.userDataPath).catch(async () => {
            await this.init();
            return await readFile(this.userDataPath);
        });
        const userDataObject: Sync.LocalDataManager.Data.User.Object = JSON.parse(buffer.toString());

        switch (entry) {
            case USER_ENTRIES.AUTH_TOKEN:
                return userDataObject.authToken;
            case USER_ENTRIES.BOT_LIST:
                return userDataObject.botList;
            case USER_ENTRIES.WORKSPACE_LIST:
                return userDataObject.workspaceList;
            default:
                return userDataObject;
        }
    }

    public async writeSyncData(entry: SYNC_ENTRIES, data: Sync.LocalDataManager.Data.Sync.Sync): Sync.LocalDataManager.Function.Write.Sync {
        const syncDataObject = <Sync.LocalDataManager.Data.Sync.Object> await this.getSyncData();

        switch (entry) {
            case SYNC_ENTRIES.BOT:
                syncDataObject.botID = <string> data;
                break;
            case SYNC_ENTRIES.COMMAND_DATA:
                syncDataObject.commandData = {
                    ...syncDataObject.commandData,
                    ... <Sync.LocalDataManager.Command.Data> data
                };
                break;
        }

        await writeFile(this.syncDataPath, JSON.stringify(syncDataObject));
    }

    public async getSyncData(entry?: SYNC_ENTRIES): Sync.LocalDataManager.Function.Get.Sync {
        const buffer = await readFile(this.syncDataPath).catch(async () => {
            await this.init();
            return await readFile(this.syncDataPath);
        });
        let syncDataObject: Sync.LocalDataManager.Data.Sync.Object;

        try {
            syncDataObject = JSON.parse(buffer.toString());
        } catch {
            syncDataObject = {
                botID: EMPTY,
                commandData: {
                    commandID: EMPTY,
                    commandLanguage: {
                        id: EMPTY,
                        name: EMPTY 
                    },
                    commandName: EMPTY,
                    commandTrigger: EMPTY
                }
            };
        }

        switch (entry) {
            case SYNC_ENTRIES.BOT:
                return syncDataObject.botID;
            case SYNC_ENTRIES.COMMAND_DATA:
                return syncDataObject.commandData;
            default:
                return syncDataObject;
        }
    }
}

export interface Entry {
    USER: UserEntry;
    SYNC: SyncEntry;
}

interface UserEntry {
    AUTH_TOKEN: 'authToken';
    BOT_LIST: 'botList';
    WORKSPACE_LIST: 'workspaceList';
}

interface SyncEntry {
    BOT: 'bot';
    COMMAND_DATA: 'commandData';

}
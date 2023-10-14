export const AUTH_TOKEN_SESSION_PART = 'default-sessionStore';

export const NEW_EMPTY_COMMAND = '$c[Created using BDFD Extension]';

export const HOSTING_ALREADY_ENDED = 'Hosting already ended';

export const LOCAL_DATA = {
    ROOT: '/.bdfd-extension/',
    DIR: 'data/',
    FILE: {
        USER: 'user.json',
        SYNC: 'sync.json',
        WORKSPACE: 'workspace.json'
    }
} as const;

export const OLD_COMMAND = {
    CREATE: {
        COMMAND: 'bdfd.sync.createCommand',
        VARIABLE: 'bdfd.sync.createVariable'
    },
    DELETE: {
        COMMAND: 'bdfd.sync.deleteCommand',
        VARIABLE: 'bdfd.sync.deleteVariable'
    },
    MODIFY: {
        COMMAND_DATA: 'bdfd.sync.modifyCommandData'
    },
    OPEN: {
        BOT_LIST: 'bdfd.sync.openBotList',
        COMMAND_LIST: 'bdfd.sync.openCommandList',
        VARIABLE_LIST: 'bdfd.sync.openVariableList'
    },
    PUSH: {
        COMMAND: 'bdfd.sync.pushCommand'
    },
    CONFIGURE: 'bdfd.sync.configure'
} as const;

export const COMMAND = {
    EDIT_COMMAND_DATA: 'bdfd-sync-feature.edit-command'
} as const;

export const AUTH_TOKEN_SESSION_PART = 'default-sessionStore';

export const LOCAL_DATA = {
    ROOT: '/.bdfd-extension/',
    DIR: 'data/v3.1/',
    FILE: {
        USER: 'user.json',
        SYNC: 'sync.json',
        WORKSPACE: 'workspace.json'
    }
} as const;

export const COMMAND = {
    DELETE_COMMAND: 'bdfd-sync-feature.delete-command',
    DELETE_VARIABLE: 'bdfd-sync-feature.delete-variable',
    EDIT_COMMAND_DATA: 'bdfd-sync-feature.edit-command',
    SWITCH_ACCOUNT: 'bdfd-sync-feature.switch-account'
} as const;

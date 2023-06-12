export const AUTH_TOKEN_SESSION_PART = 'default-sessionStore';

export const NEW_EMPTY_COMMAND = '$c[Created using BDFD Extension]';

export const LANGUAGES = Object.freeze({
    NAME: [
        'BDScript',
        'BDScript 2',
        'BDScript Unstable',
        'Javascript (ES5+BD.js)'
    ],
    ID: [
        '0',
        '3',
        '2',
        '1'
    ]
});

export const HOSTING = Object.freeze({
    ENDED: 'Hosting already ended',
    ENDS: 'Hosting ends:'
});

export const LOCAL_DATA = Object.freeze({
    DATA: {
        USER: 'C:/BDFD Extension/data/user.json',
        SYNC: 'C:/BDFD Extension/data/sync.json'
    },
    PRE_PATH: 'C:/BDFD Extension',
    PATH: 'C:/BDFD Extension/data'
});

export const COMMAND = Object.freeze({
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
});

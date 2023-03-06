import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';

const path = 'C:/BDFD Extension/data',
    /* path_backup = 'C:/BDFD Extension', */
    user_file = '/userData.json',
    sync_file = '/syncData.json',
    userData = path + user_file,
    syncData = path + sync_file;

/* User Data
{
    authToken: "token",
    botList: [
        {
            botID: id,
            botName: "name",
            commands: count,
            variables: count
        },
        {
            ...
        },
        ...
    ]
}
*/

/* Sync Data
{
    bot: {
        botID: id,
        botName: "name",
        commands: count,
        variables: count
    },
    commandID: id,
    commandName: "name",
    commandTrigger: "trigger",
    commandLanguage: "language",
    commandLanguageID: id
}
*/

export async function writeUserData() {
    if (existsSync(path) != true || existsSync(userData) != true) {
        await mkUserData();
    };

    const content = await (await fs.readFile(userData)).toString();
    let object = JSON.parse(content);

    async function authToken(token: string) {
        object.authToken = token;

        await fs.writeFile(userData, JSON.stringify(object));

        return {
            newToken: <string>object.authToken
        };
    }

    async function overwriteBotList(bot: any[]) {
        object.botList = bot;

        await fs.writeFile(userData, JSON.stringify(object));

        return {
            newList: <any[]>object.botList
        };
    }

    return {
        authToken,
        overwriteBotList
    };
}

export async function getUserData() {
    if (existsSync(path) != true || existsSync(userData) != true) {
        await mkUserData();
    };

    const content = await (await fs.readFile(userData)).toString();
    const object = JSON.parse(content);
    
    function authToken() {
        return <string>object.authToken;
    }

    function botList() {
        return <any[]>object.botList;
    };

    return {
        botList,
        authToken
    };
}

export async function writeSyncData() {
    if (existsSync(path) != true || existsSync(syncData) != true) {
        await mkSyncData()
    };

    const content = await (await fs.readFile(syncData)).toString();
    let object = JSON.parse(content);

    async function bot(botID: number, botName: string, commands: number, variables: number) {
        object.bot = {
            botID: botID,
            botName: botName,
            commands: commands,
            variables: variables
        };

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newBot: {
                botID: <number>object.bot.botID,
                botName: <string>object.bot.botName,
                commands: <number>object.bot.commands,
                variables: <number>object.bot.variables
            }
        };
    }

    async function commandID(commandID: number) {
        object.commandID = commandID;

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newCommandID: <number>object.commandID
        };
    }

    async function commandName(commandName: string) {
        object.commandName = commandName;

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newCommandName: <string>object.commandName
        };
    }

    async function commandTrigger(commandTrigger: string) {
        object.commandTrigger = commandTrigger;

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newCommandTrigger: <string>object.commandTrigger
        };
    }

    async function commandLanguage(commandLanguage: string) {
        object.commandLanguage = commandLanguage;

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newCommandLanguage: <string>object.commandLanguage
        };
    }

    async function commandLanguageID(commandLanguageID: number) {
        object.commandLanguageID = commandLanguageID;

        await fs.writeFile(syncData, JSON.stringify(object));

        return {
            newCommandLanguageID: <number>object.commandLanguageID
        };
    }

    return {
        bot,
        commandID,
        commandName,
        commandTrigger,
        commandLanguage,
        commandLanguageID
    };

}

export async function getSyncData() {
    if (existsSync(path) != true || existsSync(syncData) != true) {
        await mkSyncData()
    };

    const content = await (await fs.readFile(syncData)).toString();
    const object = JSON.parse(content);

    function bot() {
        return {
            botID: <number>object.bot.botID,
            botName: <string>object.bot.botName,
            commands: <number>object.bot.commands,
            variables: <number>object.bot.variables
        };
    }

    function commandID() {
        return <string>object.commandID;
    }

    function commandName() {
        return <string>object.commandName;
    }

    function commandTrigger() {
        return <string>object.commandTrigger;
    }

    function commandLanguage() {
        return <string>object.commandLanguage;
    }

    function commandLanguageID() {
        return <number>object.commandLanguageID;
    }

    return {
        bot,
        commandID,
        commandName,
        commandTrigger,
        commandLanguage,
        commandLanguageID
    };
}

async function mkUserData() {
    if (existsSync(path) != true) {
        await fs.mkdir('C:/BDFD Extension');
        await fs.mkdir(path);
    };

    await fs.writeFile(userData, JSON.stringify({
        authToken: "",
        botList: []
    }));
}

async function mkSyncData() {
    if (existsSync(path) != true) {
        await fs.mkdir('C:/BDFD Extension');
        await fs.mkdir(path);
    };
    
    await fs.writeFile(syncData, JSON.stringify({
        bot: {
            botID: null,
            botName: "",
            commands: null,
            variables: null
        },
        commandID: null,
        commandName: "",
        commandTrigger: "",
        commandLanguage: "",
        commandLanguageID: null
    }));
}
/*
export async function backUp() {
    async function create() { 
        if (existsSync(path_backup) != true) {
            await mkBackup();
        };

        let user: boolean = false,
            sync: boolean = false;

        if (existsSync(userData) != false) {
            await fs.copyFile(userData, path_backup);
            user = true;
        };
        if (existsSync(syncData) != false) {
            await fs.copyFile(syncData, path_backup);
            sync = true;
        };
        
        if (user && sync == true) {
            // Both
            return 3;
        } else if (user && sync == false) {
            // None
            return 0;
        } else {
            if (user == true) {
                // User Only
                return 1;
            } else {
                // Sync Only
                return 2;
            };
        };
    }

    async function load() {
        if (existsSync(path_backup) != true) {
            return false;
        } else {
            let user: boolean = false,
                sync: boolean = false;

                if (existsSync(path_backup + user_file) != false) {
                    user = true;
                };
                if (existsSync(path_backup + sync_file) != false) {
                    sync = true;
                };
            
            if (user && sync == true) {
                // Both
                await fs.copyFile(path_backup + user_file, userData);
                await fs.copyFile(path_backup + sync_file, syncData);
                return 3;
            } else if (user && sync == false) {
                // None
                return 0;
            } else {
                if (user == true) {
                    await fs.copyFile(path_backup + user_file, userData);
                    return 1;
                } else {
                    // Sync Only
                    await fs.copyFile(path_backup + sync_file, syncData);
                    return 2;
                };
            };
        };
    }

    return {
        create,
        load
    }
}

async function mkBackup() {
    await fs.mkdir(path_backup);
} */